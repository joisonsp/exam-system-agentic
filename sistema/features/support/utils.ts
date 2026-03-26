/**
 * Utilitários para testes - Helpers e funções auxiliares
 */

import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';

/**
 * Validar estrutura de um arquivo ZIP
 */
export function validateZipStructure(zipPath: string, expectedFiles: string[]): boolean {
  if (!fs.existsSync(zipPath)) {
    console.error(`Arquivo ZIP não encontrado: ${zipPath}`);
    return false;
  }

  try {
    const zip = new (AdmZip as any)(zipPath);
    const entries = zip.getEntries();
    const fileNames = entries.map((e: any) => e.entryName);

    for (const expectedFile of expectedFiles) {
      if (!fileNames.includes(expectedFile)) {
        console.error(`Arquivo esperado não encontrado no ZIP: ${expectedFile}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar ZIP:', error);
    return false;
  }
}

/**
 * Extrair e validar conteúdo de CSV
 */
export function validateCSVContent(csvPath: string, expectedColumns: string[]): boolean {
  if (!fs.existsSync(csvPath)) {
    console.error(`Arquivo CSV não encontrado: ${csvPath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    const header = lines[0].split(',');

    for (const col of expectedColumns) {
      if (!header.includes(col)) {
        console.error(`Coluna esperada não encontrada no CSV: ${col}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar CSV:', error);
    return false;
  }
}

/**
 * Calcular pontuação em modo Rigoroso
 * 1 ponto se completamente correto, 0 se qualquer erro
 */
export function calcularPontuacaoRigorosa(
  gabaritos: string[],
  respostas: string[]
): { acertos: number; erros: number; percentual: number } {
  if (gabaritos.length !== respostas.length) {
    throw new Error('Gabarito e respostas têm comprimentos diferentes');
  }

  const acertos = gabaritos.reduce(
    (acc, gab, idx) => (gab.trim().toUpperCase() === respostas[idx].trim().toUpperCase() ? acc + 1 : acc),
    0
  );

  const erros = gabaritos.length - acertos;
  const percentual = (acertos / gabaritos.length) * 100;

  return { acertos, erros, percentual };
}

/**
 * Calcular pontuação em modo Proporcional
 * Para cada resposta correta = 10 / total de questões
 */
export function calcularPontuacaoProporcional(
  gabaritos: string[],
  respostas: string[]
): { acertos: number; pontos: number; percentual: number } {
  if (gabaritos.length !== respostas.length) {
    throw new Error('Gabarito e respostas têm comprimentos diferentes');
  }

  const acertos = gabaritos.reduce(
    (acc, gab, idx) => (gab.trim().toUpperCase() === respostas[idx].trim().toUpperCase() ? acc + 1 : acc),
    0
  );

  const pontosPorAcerto = 10 / gabaritos.length;
  const pontos = acertos * pontosPorAcerto;
  const percentual = (pontos / 10) * 100;

  return { acertos, pontos, percentual };
}

/**
 * Determinar status baseado em percentual
 */
export function determinarStatus(percentual: number): string {
  if (percentual >= 80) return 'Excelente';
  if (percentual >= 60) return 'Bom';
  if (percentual >= 40) return 'Regular';
  return 'Insuficiente';
}

/**
 * Calcular estatísticas de um conjunto de resultados
 */
export function calcularEstatisticas(resultados: Array<{ percentual: number }>) {
  const percentuais = resultados.map((r) => r.percentual);

  const media = percentuais.reduce((a, b) => a + b, 0) / percentuais.length;
  const ordenados = [...percentuais].sort((a, b) => a - b);
  const mediana =
    ordenados.length % 2 === 0
      ? (ordenados[ordenados.length / 2 - 1] + ordenados[ordenados.length / 2]) / 2
      : ordenados[Math.floor(ordenados.length / 2)];

  const melhorNota = Math.max(...percentuais);
  const piorNota = Math.min(...percentuais);

  // Calcular desvio padrão
  const quadradoDiferencas = percentuais.map((p) => Math.pow(p - media, 2));
  const variancia = quadradoDiferencas.reduce((a, b) => a + b, 0) / percentuais.length;
  const desvPadrao = Math.sqrt(variancia);

  const aprovados = resultados.filter((r) => r.percentual >= 60).length;
  const reprovados = resultados.length - aprovados;

  return {
    total: resultados.length,
    media: parseFloat(media.toFixed(2)),
    mediana: parseFloat(mediana.toFixed(2)),
    melhorNota: parseFloat(melhorNota.toFixed(2)),
    piorNota: parseFloat(piorNota.toFixed(2)),
    desvPadrao: parseFloat(desvPadrao.toFixed(2)),
    aprovados,
    reprovados,
    taxaAprovacao: parseFloat(((aprovados / resultados.length) * 100).toFixed(2)),
  };
}

/**
 * Comparar percentuais de acerto entre questões
 */
export function compararDesempenhoPorQuestao(
  resultados: Array<{
    questoes: Array<{ numero: number; correta: boolean }>;
  }>
) {
  const desempenho: Record<number, { acertos: number; total: number }> = {};

  resultados.forEach((resultado) => {
    resultado.questoes.forEach((questao) => {
      if (!desempenho[questao.numero]) {
        desempenho[questao.numero] = { acertos: 0, total: 0 };
      }
      desempenho[questao.numero].total++;
      if (questao.correta) {
        desempenho[questao.numero].acertos++;
      }
    });
  });

  return Object.entries(desempenho).map(([numero, dados]) => ({
    numero: parseInt(numero),
    acertos: dados.acertos,
    total: dados.total,
    taxaAcerto: parseFloat(((dados.acertos / dados.total) * 100).toFixed(2)),
  }));
}

/**
 * Validar formato de arquivo CSV
 */
export function validarFormatoCSV(content: string, tipo: 'gabarito' | 'respostas'): boolean {
  const linhas = content.trim().split('\n');
  if (linhas.length < 2) return false;

  const [header, ...dados] = linhas.map((line) => line.split(','));

  if (tipo === 'gabarito') {
    if (!header.includes('numeroProva') || !header.includes('respostas')) {
      return false;
    }
  } else {
    if (!header.includes('nomeAluno') || !header.includes('numeroProva') || !header.includes('respostas')) {
      return false;
    }
  }

  return true;
}
