/**
 * Exemplos de Validação de Cálculos
 * 
 * Este arquivo demonstra como validar os cálculos de pontuação
 * para os diferentes modos de correção (Rigoroso vs Proporcional)
 */

import {
  calcularPontuacaoRigorosa,
  calcularPontuacaoProporcional,
  determinarStatus,
  calcularEstatisticas,
  compararDesempenhoPorQuestao,
} from './support/utils';

// ============================================
// EXEMPLO 1: Modo Rigoroso
// ============================================

console.log('=== MODO RIGOROSO ===\n');

const gabaritoProva1 = ['A', 'B', 'C', 'D'];
const respostasJoao = ['A', 'B', 'C', 'D']; // Acerto 100%
const respostasMariaRigoroso = ['A', 'B', 'C', 'A']; // Acerto 75%

const resultadoJoao = calcularPontuacaoRigorosa(gabaritoProva1, respostasJoao);
console.log('João Silva (Rigoroso):', resultadoJoao);
console.log(`  → Acertos: ${resultadoJoao.acertos}/${gabaritoProva1.length} (${resultadoJoao.percentual.toFixed(1)}%)`);
console.log(`  → Status: ${determinarStatus(resultadoJoao.percentual)}\n`);

const resultadoMaria = calcularPontuacaoRigorosa(gabaritoProva1, respostasMariaRigoroso);
console.log('Maria Santos (Rigoroso):', resultadoMaria);
console.log(`  → Acertos: ${resultadoMaria.acertos}/${gabaritoProva1.length} (${resultadoMaria.percentual.toFixed(1)}%)`);
console.log(`  → Status: ${determinarStatus(resultadoMaria.percentual)}\n`);

// ============================================
// EXEMPLO 2: Modo Proporcional
// ============================================

console.log('=== MODO PROPORCIONAL ===\n');

const respostasMariaPropo = ['A', 'B', 'D', 'A']; // Acerta 2 de 4

const resultadoMariaPropo = calcularPontuacaoProporcional(gabaritoProva1, respostasMariaPropo);
console.log('Maria Santos (Proporcional):', resultadoMariaPropo);
console.log(`  → Pontos: ${resultadoMariaPropo.pontos.toFixed(2)}/10 (${resultadoMariaPropo.percentual.toFixed(1)}%)`);
console.log(`  → Status: ${determinarStatus(resultadoMariaPropo.percentual)}\n`);

// ============================================
// EXEMPLO 3: Comparação entre modos
// ============================================

console.log('=== COMPARAÇÃO: Resultado de Maria com 3 acertos de 4 ===\n');

const respostasMaria3Acertos = ['A', 'B', 'C', 'A']; // 3 acertos

const rigorosoMaria3 = calcularPontuacaoRigorosa(gabaritoProva1, respostasMaria3Acertos);
const propoMaria3 = calcularPontuacaoProporcional(gabaritoProva1, respostasMaria3Acertos);

console.log('RIGOROSO:');
console.log(`  → Acertos: ${rigorosoMaria3.acertos}/4`);
console.log(`  → Percentual: ${rigorosoMaria3.percentual.toFixed(1)}%`);
console.log(`  → Status: ${determinarStatus(rigorosoMaria3.percentual)}\n`);

console.log('PROPORCIONAL:');
console.log(`  → Pontos: ${propoMaria3.pontos.toFixed(2)}/10`);
console.log(`  → Percentual: ${propoMaria3.percentual.toFixed(1)}%`);
console.log(`  → Status: ${determinarStatus(propoMaria3.percentual)}\n`);

// ============================================
// EXEMPLO 4: Estatísticas de Turma
// ============================================

console.log('=== ESTATÍSTICAS DE TURMA ===\n');

const turma: Array<{ percentual: number; nome: string }> = [
  { nome: 'João Silva', percentual: 100 },
  { nome: 'Maria Santos', percentual: 75 },
  { nome: 'Pedro Lima', percentual: 100 },
  { nome: 'Ana Costa', percentual: 75 },
  { nome: 'Lucas Reis', percentual: 50 },
  { nome: 'Fernanda Sales', percentual: 60 },
  { nome: 'Rafael Costa', percentual: 85 },
  { nome: 'Juliana Morales', percentual: 90 },
  { nome: 'Diego Santos', percentual: 70 },
  { nome: 'Camila Oliveira', percentual: 95 },
];

const stats = calcularEstatisticas(turma);

console.log('Métricas Gerais:');
console.log(`  → Total de alunos: ${stats.total}`);
console.log(`  → Média: ${stats.media}%`);
console.log(`  → Mediana: ${stats.mediana}%`);
console.log(`  → Maior nota: ${stats.melhorNota}%`);
console.log(`  → Menor nota: ${stats.piorNota}%`);
console.log(`  → Desvio padrão: ${stats.desvPadrao.toFixed(2)}%\n`);

console.log('Aprovação:');
console.log(`  → Aprovados (≥60%): ${stats.aprovados}`);
console.log(`  → Reprovados (<60%): ${stats.reprovados}`);
console.log(`  → Taxa de aprovação: ${stats.taxaAprovacao}%\n`);

// ============================================
// EXEMPLO 5: Análise por Questão
// ============================================

console.log('=== DESEMPENHO POR QUESTÃO ===\n');

const respostasPorQuestao = [
  {
    questoes: [
      { numero: 1, correta: true },
      { numero: 2, correta: true },
      { numero: 3, correta: true },
      { numero: 4, correta: true },
    ],
  },
  {
    questoes: [
      { numero: 1, correta: true },
      { numero: 2, correta: true },
      { numero: 3, correta: false },
      { numero: 4, correta: false },
    ],
  },
  {
    questoes: [
      { numero: 1, correta: true },
      { numero: 2, correta: false },
      { numero: 3, correta: true },
      { numero: 4, correta: true },
    ],
  },
];

const desempenho = compararDesempenhoPorQuestao(respostasPorQuestao);

console.log('Taxa de acerto por questão:');
desempenho.forEach((d) => {
  console.log(`  → Q${d.numero}: ${d.acertos}/${d.total} acertos (${d.taxaAcerto.toFixed(1)}%)`);
});

console.log('\nQuestões com baixo desempenho (< 50%):');
const baixoDesempenho = desempenho.filter((d) => d.taxaAcerto < 50);
if (baixoDesempenho.length === 0) {
  console.log('  → Nenhuma');
} else {
  baixoDesempenho.forEach((d) => {
    console.log(`  → Q${d.numero}: ${d.taxaAcerto.toFixed(1)}% (Necessita revisão)`);
  });
}

console.log('\n✅ Exemplos de validação completos!');
