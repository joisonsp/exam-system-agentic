"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSingleProva = generateSingleProva;
exports.generatePDFFromProva = generatePDFFromProva;
exports.createGabaritoCSV = createGabaritoCSV;
exports.generateProvasAndGabarito = generateProvasAndGabarito;
const pdfkit_1 = __importDefault(require("pdfkit"));
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function getAlternativaId(index, modo) {
    if (modo === 'letras') {
        return String.fromCharCode(65 + index); // A, B, C, D, ...
    }
    else {
        // potências: 2^1, 2^2, 2^3, ...
        return Math.pow(2, index + 1).toString();
    }
}
function embaralhadorQuestoes(questoes, modo) {
    // Embaralha ordem das questões
    const questoesEmbaralhadas = shuffleArray(questoes);
    return questoesEmbaralhadas.map((q) => {
        // Para cada questão, embaralha as alternativas
        const alternativasComIndice = q.alternativas.map((alt, idx) => ({
            ...alt,
            original_index: idx
        }));
        const alternativasEmbaralhadas = shuffleArray(alternativasComIndice);
        // Encontra qual é o índice da alternativa correta após embaralhamento
        const indexCorreta = alternativasEmbaralhadas.findIndex((alt) => alt.correta);
        return {
            id: q.id,
            enunciado: q.enunciado,
            alternativasOriginais: alternativasEmbaralhadas.map((alt, idx) => ({
                id: getAlternativaId(idx, modo),
                descricao: alt.descricao,
                original_index: alt.original_index
            })),
            indexCorretaAposEmbaralhamento: indexCorreta
        };
    });
}
function gerarGabaritoProva(questoesEmb, modo) {
    if (modo === 'letras') {
        return questoesEmb.map((q) => getAlternativaId(q.indexCorretaAposEmbaralhamento, modo));
    }
    else {
        // Para potências, retorna a resposta correta
        return questoesEmb.map((q) => getAlternativaId(q.indexCorretaAposEmbaralhamento, modo));
    }
}
function generateSingleProva(prova, numero, questoesCompletas) {
    // Filtra apenas as questões que fazem parte dessa prova
    const questoesDaProva = questoesCompletas.filter((q) => prova.questoesIds.includes(q.id));
    const questoesEmb = embaralhadorQuestoes(questoesDaProva, prova.identificacaoAlternativas);
    const gabarito = gerarGabaritoProva(questoesEmb, prova.identificacaoAlternativas);
    return { numero, questoes: questoesEmb, gabarito };
}
function generatePDFFromProva(provaGerada, nomeProva, professor = '', disciplina = '') {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const doc = new pdfkit_1.default({ margin: 40 });
        const pageHeight = doc.page.height;
        const pageWidth = doc.page.width;
        const footerY = pageHeight - 30;
        // Função auxiliar para adicionar cabeçalho em cada página
        const addHeader = () => {
            doc.fontSize(14).font('Helvetica-Bold').text('PROVA', { align: 'center' });
            if (disciplina) {
                doc.fontSize(11).font('Helvetica').text(`Disciplina: ${disciplina}`, { align: 'center' });
            }
            doc.fontSize(12).font('Helvetica-Bold').text(nomeProva, { align: 'center' });
            if (professor) {
                doc.fontSize(10).font('Helvetica').text(`Professor(a): ${professor}`, { align: 'center' });
            }
            doc.fontSize(9).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
            doc.fontSize(9).text(`Prova nº: ${String(provaGerada.numero).padStart(3, '0')}`, { align: 'center' });
            doc.moveTo(50, doc.y).lineTo(pageWidth - 40, doc.y).stroke();
            doc.moveDown();
        };
        // Função auxiliar para adicionar rodapé em cada página
        const addFooter = () => {
            doc.fontSize(8).font('Helvetica');
            doc.text(`Prova nº ${String(provaGerada.numero).padStart(3, '0')} - Página ${doc.bufferedPageRange().count}`, 50, footerY, { align: 'center' });
        };
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
        try {
            // Adiciona cabeçalho na primeira página
            addHeader();
            // Questões
            let questaoInicial = true;
            provaGerada.questoes.forEach((q, idx) => {
                // Verifica se precisa de nova página (deixando espaço para rodapé)
                if (!questaoInicial && doc.y > pageHeight - 120) {
                    addFooter();
                    doc.addPage({ margin: 40 });
                    addHeader();
                }
                questaoInicial = false;
                doc.fontSize(11).font('Helvetica-Bold').text(`${idx + 1}. ${q.enunciado}`, { align: 'justify' });
                doc.fontSize(10).font('Helvetica');
                q.alternativasOriginais.forEach((alt) => {
                    doc.text(`     (${alt.id}) ${alt.descricao}`);
                });
                doc.moveDown(0.8);
            });
            // Adiciona espaço para respostas do aluno
            if (doc.y > pageHeight - 150) {
                addFooter();
                doc.addPage({ margin: 40 });
            }
            doc.moveTo(50, doc.y).lineTo(pageWidth - 40, doc.y).stroke();
            doc.moveDown();
            // Identificação do aluno
            doc.fontSize(11).font('Helvetica-Bold').text('IDENTIFICAÇÃO DO ALUNO', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');
            doc.text('Nome completo: ________________________________________________________________________');
            doc.moveDown(0.3);
            doc.text('CPF (somente números): _________________________________________________________________');
            doc.moveDown(0.3);
            doc.text('Matrícula: ______________________________________________________________________________');
            doc.moveDown(0.3);
            doc.text('Data: ______ / ______ / ________');
            doc.moveDown(0.3);
            doc.text('Assinatura: _____________________________________________________________________________');
            // Adiciona rodapé na última página
            addFooter();
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
function createGabaritoCSV(gabaritos) {
    if (gabaritos.length === 0) {
        return 'numero_prova\n';
    }
    const maxQuestoes = Math.max(...gabaritos.map((item) => item.respostas.length));
    const headers = ['numero_prova', ...Array.from({ length: maxQuestoes }, (_, i) => `gabarito_q${i + 1}`)];
    let csv = headers.join(',') + '\n';
    gabaritos.forEach((item) => {
        const row = [String(item.numeroProva), ...item.respostas];
        while (row.length < headers.length) {
            row.push('');
        }
        csv += row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    return csv;
}
async function generateProvasAndGabarito(prova, quantidade, questoesCompletas, professor, disciplina) {
    const gabaritos = [];
    const provas = [];
    // Gera N provas
    for (let i = 1; i <= quantidade; i++) {
        const provaGerada = generateSingleProva(prova, i, questoesCompletas);
        const pdfBuffer = await generatePDFFromProva(provaGerada, prova.nome, professor, disciplina);
        provas.push(pdfBuffer);
        gabaritos.push({
            numeroProva: i,
            respostas: provaGerada.gabarito
        });
    }
    // Cria arquivo de gabarito CSV
    const csvContent = createGabaritoCSV(gabaritos);
    return { gabarito: csvContent, provas };
}
