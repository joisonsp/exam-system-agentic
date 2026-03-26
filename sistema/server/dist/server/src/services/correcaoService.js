"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
exports.parseGabaritoCSV = parseGabaritoCSV;
exports.corrigirProva = corrigirProva;
exports.gerarRelatorio = gerarRelatorio;
exports.resultadosToCSV = resultadosToCSV;
exports.corrigirProvas = corrigirProvas;
function splitCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            const nextChar = line[i + 1];
            if (inQuotes && nextChar === '"') {
                current += '"';
                i += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    result.push(current);
    return result.map((field) => field.trim());
}
function normalizeAnswer(value) {
    return value.replace(/"/g, '').trim().toUpperCase();
}
/**
 * Parse CSV buffer into array of resposta aluno objects
 * Expected format: nomeAluno,numeroProva,respostas
 * Example: "João Silva,1,"A,B,C,D"
 */
function parseCSV(fileBuffer) {
    const fileContent = fileBuffer.toString('utf-8').replace(/\r/g, '');
    const linhas = fileContent.split('\n').filter((line) => line.trim());
    if (linhas.length === 0) {
        return [];
    }
    const headerFields = splitCsvLine(linhas[0]).map((h) => h.toLowerCase());
    const temHeader = headerFields.includes('nomealuno') && headerFields.includes('numeroprova');
    const dataLinhas = temHeader ? linhas.slice(1) : linhas;
    return dataLinhas.map((linha) => {
        const fields = splitCsvLine(linha);
        if (fields.length < 2) {
            throw new Error(`Formato CSV inválido (respostas): ${linha}`);
        }
        const nomeAluno = fields[0];
        const numeroProva = parseInt(fields[1], 10);
        if (isNaN(numeroProva)) {
            throw new Error(`Número de prova inválido (respostas): ${fields[1]}`);
        }
        let respostas = [];
        if (fields.length === 2) {
            throw new Error(`CSV de respostas não contém respostas: ${linha}`);
        }
        // Formato 1: nomeAluno,numeroProva,respostas (campo único)
        if (fields.length === 3 && headerFields.includes('respostas')) {
            respostas = fields[2]
                .split(',')
                .map(normalizeAnswer)
                .filter((r) => r);
        }
        else {
            // Formato 2: nomeAluno,numeroProva,resposta_q1,resposta_q2,...
            respostas = fields.slice(2).map(normalizeAnswer).filter((r) => r);
            // Se só houve um campo de resposta com vírgulas, explode também
            if (respostas.length === 1 && respostas[0].includes(',')) {
                respostas = respostas[0]
                    .split(',')
                    .map(normalizeAnswer)
                    .filter((r) => r);
            }
        }
        return { nomeAluno, numeroProva, respostas };
    });
}
/**
 * Parse gabarito CSV into array of GabaritoProva objects
 * Expected format: numeroProva,respostas
 * Example: "1,"A,B,C,D"
 */
function parseGabaritoCSV(fileBuffer) {
    const fileContent = fileBuffer.toString('utf-8').replace(/\r/g, '');
    const linhas = fileContent.split('\n').filter((line) => line.trim());
    if (linhas.length === 0) {
        return new Map();
    }
    const headerFields = splitCsvLine(linhas[0]).map((h) => h.toLowerCase());
    const temHeader = headerFields.includes('numero_prova') || headerFields.includes('numeroprova');
    const dataLinhas = temHeader ? linhas.slice(1) : linhas;
    const gabarito = new Map();
    dataLinhas.forEach((linha) => {
        const fields = splitCsvLine(linha);
        if (fields.length < 2) {
            throw new Error(`Formato CSV inválido no gabarito: ${linha}`);
        }
        const numeroProva = parseInt(fields[0], 10);
        if (isNaN(numeroProva)) {
            throw new Error(`Número de prova inválido no gabarito: ${fields[0]}`);
        }
        let respostas = [];
        if (headerFields.some((h) => h.includes('gabarito_') || h.includes('resposta_q'))) {
            respostas = fields.slice(1).map(normalizeAnswer).filter((r) => r);
        }
        else if (fields.length === 2) {
            respostas = fields[1]
                .split(',')
                .map(normalizeAnswer)
                .filter((r) => r);
        }
        else {
            respostas = fields.slice(1).map(normalizeAnswer).filter((r) => r);
        }
        if (respostas.length === 0) {
            throw new Error(`Gabarito vazio para prova ${numeroProva}`);
        }
        gabarito.set(numeroProva, respostas);
    });
    return gabarito;
}
/**
 * Correct a proof based on student answers
 * Modo "rigoroso": 1 ponto se completamente correto, 0 se qualquer alternativa errada
 * Modo "proporcional": calcula porcentagem de alternativas corretas
 */
function corrigirProva(gabarito, respostasAluno, modo = 'rigoroso') {
    const total = gabarito.length;
    let acertos = 0;
    const questoesCorretas = [];
    const questoesErradas = [];
    // Ensure same length
    const respostasAlunoPadded = respostasAluno.slice(0, total);
    while (respostasAlunoPadded.length < total) {
        respostasAlunoPadded.push('');
    }
    if (modo === 'rigoroso') {
        // Each question is binary: correct or wrong
        for (let i = 0; i < total; i++) {
            const gabaritoCerta = gabarito[i].toUpperCase();
            const respostaCerta = respostasAlunoPadded[i].toUpperCase();
            if (gabaritoCerta === respostaCerta) {
                acertos += 1;
                questoesCorretas.push(i + 1);
            }
            else {
                questoesErradas.push(i + 1);
            }
        }
    }
    else if (modo === 'proporcional') {
        // Calculate proportion of correct answers
        for (let i = 0; i < total; i++) {
            const gabaritoCerta = gabarito[i].toUpperCase();
            const respostaCerta = respostasAlunoPadded[i].toUpperCase();
            if (gabaritoCerta === respostaCerta) {
                acertos += 1;
                questoesCorretas.push(i + 1);
            }
            else {
                questoesErradas.push(i + 1);
            }
        }
    }
    const percentual = (acertos / total) * 100;
    return {
        acertos,
        total,
        percentual,
        modo,
        questoesCorretas,
        questoesErradas
    };
}
/**
 * Gera relatório de correção
 * Recebe mapa de gabarito e array de respostas de alunos
 * Retorna array com resultados detalhados
 */
function gerarRelatorio(gabarito, respostasAlunos, modo = 'rigoroso') {
    const resultados = [];
    for (const resposta of respostasAlunos) {
        const { nomeAluno, numeroProva, respostas } = resposta;
        // Buscar gabarito da prova
        const gabaritoProva = gabarito.get(numeroProva);
        if (!gabaritoProva) {
            console.warn(`Gabarito não encontrado para prova ${numeroProva}`);
            continue;
        }
        // Corrigir prova
        const correcao = corrigirProva(gabaritoProva, respostas, modo);
        // Determinar status baseado no percentual
        let status = 'Insuficiente';
        if (correcao.percentual >= 80) {
            status = 'Excelente';
        }
        else if (correcao.percentual >= 60) {
            status = 'Bom';
        }
        else if (correcao.percentual >= 40) {
            status = 'Regular';
        }
        resultados.push({
            nomeAluno,
            numeroProva,
            acertos: correcao.acertos,
            total: correcao.total,
            percentual: correcao.percentual,
            status
        });
    }
    return resultados;
}
/**
 * Convert results array to CSV string
 */
function resultadosToCSV(resultados) {
    // CSV header
    const headers = ['Nome do Aluno', 'Número Prova', 'Acertos', 'Total', 'Percentual (%)', 'Status'];
    const csvLines = [headers.join(',')];
    // CSV data rows
    for (const resultado of resultados) {
        const row = [
            `"${resultado.nomeAluno}"`,
            resultado.numeroProva,
            resultado.acertos,
            resultado.total,
            resultado.percentual.toFixed(2),
            resultado.status
        ];
        csvLines.push(row.join(','));
    }
    return csvLines.join('\n');
}
/**
 * Main correction function
 * Receives gabarito CSV buffer and respostas CSV buffer
 * Returns correction results as array and CSV string
 */
function corrigirProvas(gabaritoBuffer, respostasBuffer, modo = 'rigoroso') {
    try {
        // Parse both CSVs
        const gabarito = parseGabaritoCSV(gabaritoBuffer);
        const respostasAlunos = parseCSV(respostasBuffer);
        // Generate report
        const resultados = gerarRelatorio(gabarito, respostasAlunos, modo);
        // Convert to CSV
        const csv = resultadosToCSV(resultados);
        return { resultados, csv };
    }
    catch (error) {
        throw new Error(`Erro ao corrigir provas: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
}
