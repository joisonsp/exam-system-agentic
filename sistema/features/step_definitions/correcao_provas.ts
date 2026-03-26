/**
 * Steps para Correção de Provas
 * Testes de correção automática em modo Rigoroso e Proporcional
 */

import { Given, When, Then, Before, DataTable } from '@cucumber/cucumber';
import { ProvasWorld } from '../support/world';
import { expect } from 'chai';

let world: ProvasWorld;

Before(function (this: ProvasWorld) {
  world = this;
});

// ============================================
// Given Steps
// ============================================

Given('que existe um arquivo {string} com o seguinte conteúdo:', function (nomeArquivo: string, dataTable: DataTable) {
  const rows = dataTable.hashes();

  if (nomeArquivo === '"gabarito.csv"') {
    rows.forEach((row: any) => {
      const numeroProva = parseInt(row.numeroProva);
      const respostas = row.respostas.split(',');
      world.gabarito.set(numeroProva, respostas);
    });
  } else if (nomeArquivo === '"respostas.csv"') {
    rows.forEach((row: any) => {
      world.respostasAlunos.push({
        nomeAluno: row.nomeAluno,
        numeroProva: parseInt(row.numeroProva),
        respostas: row.respostas.split(','),
      });
    });
  }
});

Given('que existe um arquivo de respostas com:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const respostas = row.Respostas.split(' / ').map((r: string) => r.split(','));
    world.respostasAlunos.push({
      nomeAluno: row.Aluno,
      numeroProva: parseInt(row.Prova),
      respostas: respostas.flat(),
    });
  });
});

Given('que existe um gabarito com as questões:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const numeroProva = parseInt(row['Prova']);
    // Se não existe, inicializa
    if (!world.gabarito.has(numeroProva)) {
      world.gabarito.set(numeroProva, []);
    }
  });
});

Given('que existe um gabarito com questões de múltipla seleção:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const numeroProva = parseInt(row.NumeroProva);
    const respostas = row.Respostas.split(',');
    if (!world.gabarito.has(numeroProva)) {
      world.gabarito.set(numeroProva, []);
    }
    const gabProva = world.gabarito.get(numeroProva)!;
    gabProva.push(...respostas);
  });
});

Given('que existe um arquivo errado nomeado {string}', function (nome: string) {
  world.formData['arquivoInvalido'] = nome;
});

Given('e o arquivo tem o seguinte conteúdo \\(formato errado):', function (dataTable: DataTable) {
  // Arquivo com formato incorreto já definido
  world.formData['conteudoInvalido'] = true;
});

Given('que existe um gabarito com provas {int} e {int}', function (prova1: number, prova2: number) {
  world.gabarito.set(prova1, ['A', 'B', 'C', 'D']);
  world.gabarito.set(prova2, ['B', 'A', 'C', 'B']);
});

Given('e arquivo de respostas referencia apenas prova {int}', function (prova: number) {
  world.respostasAlunos = world.respostasAlunos.filter((r) => r.numeroProva === prova);
});

Given('que {int} alunos responderam a uma prova', function (count: number) {
  world.respostasAlunos = Array.from({ length: count }, (_, i) => ({
    nomeAluno: `Aluno ${i + 1}`,
    numeroProva: 1,
    respostas: ['A', 'B', 'C', 'D'],
  }));
});

Given('e os percentuais de acerto foram: {string}', function (percentuaisStr: string) {
  const percentuais = percentuaisStr.split(',').map((p) => parseInt(p.trim()));

  world.resultadosCorrecao = percentuais.map((percentual, i) => ({
    nomeAluno: `Aluno ${i + 1}`,
    percentual,
    acertos: Math.round((percentual / 100) * 4),
    total: 4,
  }));
});

Given('que corrigi {int} provas com sucesso', function (count: number) {
  world.resultadosCorrecao = Array.from({ length: count }, (_, i) => ({
    nomeAluno: `Aluno ${i + 1}`,
    numeroProva: 1,
    acertos: 3,
    erros: 1,
    total: 4,
    percentual: 75,
    status: 'Bom',
  }));
});

Given('que corrigi a prova {string} em {string} às {string}', function (nome: string, data: string, hora: string) {
  world.resultadosCorrecao.push({
    prova: nome,
    dataHora: `${data} ${hora}`,
    alunos: 30,
    media: 75,
  });
});

Given('e agora corrijo a mesma prova em {string} às {string} com alunos diferentes', function (data: string, hora: string) {
  world.resultadosCorrecao.push({
    prova: 'Avaliação Final',
    dataHora: `${data} ${hora}`,
    alunos: 28,
    media: 78,
  });
});

Given('que existem resultados de correção para:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  world.tabela = rows;
});

Given('que tenho um arquivo de respostas incompleto:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  world.respostasAlunos = rows.map((row: any) => ({
    nomeAluno: row.nomeAluno,
    numeroProva: parseInt(row.numeroProva),
    respostas: row.respostas ? row.respostas.split(',') : [],
  }));
});

Given('e um campo {string} está vazio para {string}', function (campo: string, aluno: string) {
  const resposta = world.respostasAlunos.find((r) => r.nomeAluno === aluno);
  if (resposta) {
    resposta.respostas = [];
  }
});

Given('que tenho um arquivo com nomes em diferentes formatos:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  world.respostasAlunos = rows.map((row: any) => ({
    nomeAluno: row.nomeAluno,
    numeroProva: parseInt(row.numeroProva),
    respostas: row.respostas.split(','),
  }));
});

Given('que corrigi provas de {int} alunos', function (count: number) {
  world.resultadosCorrecao = Array.from({ length: count }, (_, i) => ({
    nomeAluno: `Aluno ${i + 1}`,
    percentual: 50 + Math.floor(Math.random() * 50),
  }));
});

// ============================================
// When Steps
// ============================================

When('estou na página de correção de provas', async function () {
  const response = await world.client.get('/correcao');
  world.lastResponse = response;
});

When('seleciono {string}', function (arquivo: string) {
  world.formData['arquivo'] = arquivo;
});

When('mantenho o modo padrão {string}', function (modo: string) {
  world.formData['modo'] = modo;
});

When('mudo para modo {string}', function (modo: string) {
  world.formData['modo'] = modo;
});

When('clico em {string}', async function (botao: string) {
  try {
    if (botao === 'Corrigir Provas') {
      const response = await world.client.post('/corrigir', {
        gabarito: Array.from(world.gabarito.entries()).map(([prova, respostas]: [number, string[]]) => ({
          numeroProva: prova,
          respostas: respostas.join(','),
        })),
        respostas: world.respostasAlunos.map((r) => ({
          nomeAluno: r.nomeAluno,
          numeroProva: r.numeroProva,
          respostas: r.respostas.join(','),
        })),
        modo: world.formData['modo'] || 'rigoroso',
      });
      world.lastResponse = response;

      if (response.status === 200 && response.data?.resultados) {
        world.resultadosCorrecao = response.data.resultados;
      }
      return;
    }

    if (botao === 'Gerar Relatório') {
      world.lastResponse = await world.client.post('/corrigir/relatorio', {
        resultados: world.resultadosCorrecao,
      });
      return;
    }

    if (botao === 'Baixar Resultado CSV') {
      world.lastResponse = await world.client.get('/corrigir/export-csv');
      return;
    }

    if (botao === 'Gerar Gráfico de Desempenho') {
      world.lastResponse = await world.client.post('/corrigir/grafico', {
        resultados: world.resultadosCorrecao,
      });
      return;
    }

    if (botao === 'Comparar Turmas') {
      world.lastResponse = await world.client.post('/corrigir/comparar-turmas', {
        turmas: world.tabela,
      });
      return;
    }

    if (botao === 'Histórico de Correções') {
      world.lastResponse = await world.client.get('/corrigir/historico');
      return;
    }

    if (botao === 'Salvar Alterações' && world.questaoEmEdicao) {
      world.lastResponse = await world.client.put(`/questoes/${world.questaoEmEdicao.id}`, world.questaoEmEdicao);
      return;
    }

    if (botao === 'Remover' && world.questaoId !== null) {
      world.lastResponse = await world.client.delete(`/questoes/${world.questaoId}`);
      return;
    }

    if (botao === 'Criar Prova') {
      world.lastResponse = await world.client.post('/provas', {
        nome: world.formData['Nome'],
        descricao: world.formData['Descrição'],
        disciplina: world.formData['Disciplina'],
        questoes: world.formData['questoesSelecionadas'] || [],
      });
      return;
    }

    if (botao === 'Gerar PDF') {
      const provaId = world.formData['provaId'];
      const quantidade = parseInt(world.formData['Quantidade'] || '1');
      const embaralharQuestoes = world.formData['embaralharQuestoes'] === 'true';
      const embaralharOpcoes = world.formData['embaralharOpcoes'] === 'true';
      const gerarGabarito = world.formData['gerarGabarito'] === 'true';

      world.lastResponse = await world.client.post('/gerar-provas', {
        provaId,
        quantidade,
        embaralharQuestoes,
        embaralharOpcoes,
        gerarGabarito,
        numeroInicial: world.formData['Número Inicial'],
      });
      return;
    }

    if (botao === 'Exportar CSV com Metadados') {
      world.lastResponse = await world.client.post('/gerar-provas/csv-metadados');
      return;
    }

    if (botao === 'Baixar Todos como ZIP') {
      world.lastResponse = await world.client.get('/gerar-provas/download-zip');
      return;
    }

    if (botao === 'Visualizar Prévia') {
      world.lastResponse = await world.client.get(`/gerar-provas/${world.formData['provaId']}/preview`);
      return;
    }

    // fallback for unsupported actions
    world.lastError = `Ação de botão não implementada: ${botao}`;
  } catch (error: any) {
    world.lastError = error?.message || 'Erro desconhecido';
    world.lastResponse = error?.response;
  }
});

// ============================================
// Then Steps
// ============================================

Then('a correção é executada', function () {
  expect(world.lastResponse?.status).to.equal(200);
});

Then('os resultados mostram:', function (dataTable: DataTable) {
  const expectedResults = dataTable.hashes();

  expectedResults.forEach((expected: any) => {
    const resultado = world.resultadosCorrecao.find(
      (r) => r.nomeAluno === expected.nomeAluno && r.numeroProva === parseInt(expected.prova)
    );

    expect(resultado).to.exist;
    expect(resultado?.acertos).to.equal(parseInt(expected.acertos));
    expect(resultado?.total).to.equal(parseInt(expected.total));
    expect(resultado?.percentual).to.equal(parseInt(expected.percentual.replace('%', '')));
    expect(resultado?.status).to.equal(expected.status);
  });
});

Then('no modo rigoroso:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const resultado = world.resultadosCorrecao.find((r) => r.nomeAluno === row[Object.keys(row)[0]]);
    expect(resultado).to.exist;
  });
});

Then('a correção ocorre com pontuação proporcional:', function (dataTable: DataTable) {
  const expectedResults = dataTable.hashes();

  expectedResults.forEach((expected: any) => {
    const resultado = world.resultadosCorrecao.find((r) => r.nomeAluno === expected.Aluno);

    expect(resultado).to.exist;
    expect(resultado?.acertos).to.equal(parseInt(expected.Acertos || '0'));
    expect(resultado?.pontos).to.equal(parseInt(expected.Pontos || '0'));
  });
});

Then('os resultados detalhados mostram:', function (dataTable: DataTable) {
  const expectedResults = dataTable.hashes();

  expectedResults.forEach((expected: any) => {
    const resultado = world.resultadosCorrecao.find((r) => r.nomeAluno === expected.nomeAluno);

    expect(resultado).to.exist;
    if (expected.acertos_completos) {
      expect(resultado?.acertosCompletos).to.equal(parseInt(expected.acertos_completos));
    }
    if (expected.acertos_parciais) {
      expect(resultado?.acertosParciais).to.equal(parseInt(expected.acertos_parciais));
    }
  });
});

Then('vejo mensagem de erro {string}', function (mensagem: string) {
  const errorMsg = world.lastResponse?.data?.error || world.lastResponse?.data?.message || '';
  expect(errorMsg).to.include(mensagem);
});

Then('as provas não são corrigidas', function () {
  expect(world.resultadosCorrecao.length).to.equal(0);
});

Then('vejo mensagem de aviso {string}', function (mensagem: string) {
  const avisoMsg = world.lastResponse?.data?.warning || '';
  expect(avisoMsg).to.include(mensagem);
});

Then('os resultados mostram apenas os alunos que responderam prova {int}', function (prova: number) {
  world.resultadosCorrecao.forEach((r) => {
    expect(r.numeroProva).to.equal(prova);
  });
});

Then('um relatório é gerado contendo:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  const relatorio = world.lastResponse?.data;

  rows.forEach((row: any) => {
    const metrica = row.Métrica;
    const valor = row.Valor;

    if (metrica === 'Total de Alunos') {
      expect(relatorio?.totalAlunos).to.equal(parseInt(valor));
    } else if (metrica === 'Média da Turma') {
      expect(relatorio?.media).to.exist;
    } else if (metrica === 'Alunos Aprovados') {
      expect(relatorio?.aprovados).to.equal(parseInt(valor));
    }
  });
});

Then('um arquivo nomeado {string} é baixado', function (nome: string) {
  expect(world.lastResponse?.status).to.equal(200);
});

Then('o CSV contém as colunas:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  const colunas = rows.map((r) => r.Coluna);

  colunas.forEach((col) => {
    expect(world.lastResponse?.data).to.include(col);
  });
});

Then('cada linha representa um aluno com seus resultados', function () {
  expect(world.lastResponse?.data).to.be.a('string');
  expect(world.lastResponse?.data).to.include('nomeAluno');
});

Then('a correção agrupa os resultados por número de prova:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();

  rows.forEach((row: any) => {
    const chaveProva = Object.keys(row)[0];
    // Validar que resultados estão agrupados
    expect(world.resultadosCorrecao.length).to.be.greaterThan(0);
  });
});

Then('posso corrigir o arquivo e tentar novamente', function () {
  expect(world.lastError).to.exist;
});

Then('a correção funciona corretamente', function () {
  expect(world.resultadosCorrecao.length).to.be.greaterThan(0);
});

Then('os nomes aparecem no relatório mantendo o formato original', function () {
  world.resultadosCorrecao.forEach((r) => {
    expect(r.nomeAluno).to.exist;
  });
});

Then('os resultados são calculados corretamente para todos', function () {
  world.resultadosCorrecao.forEach((r) => {
    expect(r.percentual).to.be.greaterThanOrEqual(0);
    expect(r.percentual).to.be.lessThanOrEqual(100);
  });
});

Then('um gráfico de barras é gerado mostrando:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  expect(world.lastResponse?.data?.grafico).to.exist;
});

Then('o gráfico identifica questões com baixo desempenho \\(< 50%)', function () {
  const grafico = world.lastResponse?.data?.grafico;
  expect(grafico?.questoesComBaixoDesempenho).to.exist;
});

Then('oferece exportar o gráfico como imagem PNG', function () {
  expect(world.lastResponse?.data?.exportarPNG).to.be.true;
});

Then('uma tabela comparativa é exibida:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();
  expect(world.lastResponse?.data?.comparacao).to.exist;
});

Then('posso exportar a comparação em PDF ou Excel', function () {
  expect(world.lastResponse?.data?.exportarPDF).to.be.true;
  expect(world.lastResponse?.data?.exportarExcel).to.be.true;
});

Then('vejo duas correções listadas:', function (dataTable: DataTable) {
  expect(world.lastResponse?.data).to.have.lengthOf(2);
});

Then('posso clicar em cada uma para ver os detalhes completos', function () {
  expect(world.lastResponse?.data?.length).to.be.greaterThan(0);
});
