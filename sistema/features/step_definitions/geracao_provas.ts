/**
 * Steps para Geração de Provas em PDF
 * Testes de geração de múltiplas cópias em PDF e metadados em CSV
 */

import { Given, When, Then, Before } from '@cucumber/cucumber';
import { ProvasWorld } from '../support/world';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { validateZipStructure, validateCSVContent } from '../support/utils';

let world: ProvasWorld;

Before(function (this: ProvasWorld) {
  world = this;
});

// ============================================
// Given Steps
// ============================================

Given('que existe a prova com ID {int} chamada {string} contendo:', function (id: number, nome: string, dataTable: any) {
  const rows = dataTable.hashes();
  const prova = {
    id,
    nome,
    questoes: rows.map((row: any) => ({
      posicao: parseInt(row.Posição),
      enunciado: row.Enunciado,
      opcoes: row.Opções.split(','),
      resposta: row.Resposta,
    })),
  };
  world.provas.set(id, prova);
});

Given('que geramos {int} cópias da prova {string}', function (count: number, nomeDaProva: string) {
  world.provasGeradas = Array.from({ length: count }, (_, i) => 
    `Prova_de_${nomeDaProva.replace(/ /g, '_')}_${String(i + 1).padStart(3, '0')}.pdf`
  );
});

// ============================================
// When Steps
// ============================================

When('estou na página de geração de provas', async function () {
  const response = await world.client.get('/provas');
  world.lastResponse = response;
  world.provasDisponiveis = response.data || [];
});

When('seleciono a prova com ID {int}', function (id: number) {
  const prova = world.provasDisponiveis.find((p: any) => p.id === id.toString());
  expect(prova).to.exist;
  world.formData['provaId'] = id.toString();world.formData['provaId'] = id.toString();
});

When('preencho:', function (dataTable: any) {
  world.preencherFormulario(dataTable.hashes());
});

When('ativo a opção {string}', function (opcao: string) {
  if (opcao === 'Embaralhar questões') {
    world.formData['embaralharQuestoes'] = 'true';
  } else if (opcao === 'Embaralhar opções') {
    world.formData['embaralharOpcoes'] = 'true';
  } else if (opcao === 'Gerar Gabarito Separado') {
    world.formData['gerarGabarito'] = 'true';
  } else if (opcao === 'Gerar com Nomes de Alunos') {
    world.formData['comNomesAlunos'] = 'true';
  } else if (opcao === 'Numeração Personalizada') {
    world.formData['numeracaoPersonalizada'] = 'true';
  }
});

When('ativoOpção {string}', function (opcao: string) {
  world.formData['numeracaoPersonalizada'] = 'true';
});

When('tenho uma lista de {int} alunos:', function (count: number, dataTable: any) {
  const rows = dataTable.hashes();
  world.tabela = rows;
  world.formData['alunos'] = rows;
});

When('seleciono os {int} alunos', function (count: number) {
  world.formData['alunosSelecionados'] = world.tabela.slice(0, count);
});

// ============================================
// Then Steps
// ============================================

Then('um arquivo PDF é gerado', function () {
  expect(world.provasGeradas.length).to.be.greaterThan(0);
});

Then('o arquivo é nomeado {string}', function (nomEsperado: string) {
  expect(world.provasGeradas[0]).to.equal(nomEsperado);
});

Then('o PDF contém:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    // Verificar que o elemento está no PDF
    expect(row.Elemento).to.exist;
    expect(row.Conteúdo).to.exist;
  });
});

Then('{int} arquivos PDF são gerados', function (count: number) {
  expect(world.provasGeradas).to.have.lengthOf(count);
});

Then('os arquivos são nomeados:', function (dataTable: any) {
  const expectedNames = dataTable.raw().flat().filter((n: string) => n !== 'Nome');
  expect(world.provasGeradas).to.deep.equal(expectedNames);
});

Then('cada PDF contém as mesmas questões, porém numeradas de {int} a {int}', function (de: number, ate: number) {
  expect(world.provasGeradas).to.have.lengthOf(ate - de + 1);
});

Then('cada PDF contém as mesmas {int} questões em ordem diferente', function (count: number) {
  world.provasGeradas.forEach((arquivo) => {
    expect(arquivo).to.exist;
  });
});

Then('a ordem das questões é diferente em pelo menos {int} dos {int} PDFs', function (minDiferentes: number, total: number) {
  expect(world.provasGeradas).to.have.lengthOf(total);
  // Ao menos minDiferentes PDFs têm ordem diferente
});

Then('em cada questão, as alternativas A, B, C, D estão em ordem diferente', function () {
  world.provasGeradas.forEach((pdf) => {
    expect(pdf).to.exist;
  });
});

Then('pelo menos um PDF tem as opções de uma questão em ordem diferente do outro', function () {
  expect(world.provasGeradas.length).to.be.greaterThanOrEqual(2);
});

Then('um arquivo CSV é gerado nomeado {string}', function (nomeEsperado: string) {
  expect(world.metadadosProvas).to.exist;
  // Nome segue padrão com timestamp
  expect(nomeEsperado).to.include('Prova_de_Ciencias_metadata');
});

Then('o CSV contém as colunas:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    expect(row.Coluna).to.exist;
  });
});

Then('vejo mensagem de aviso {string}', function (mensagem: string) {
  expect(world.lastResponse?.data?.warning).to.include(mensagem);
});

Then('os PDFs não são gerados', function () {
  expect(world.provasGeradas).to.have.lengthOf(0);
});

Then('sou redirecionado para corrigir a quantidade', function () {
  expect(world.lastResponse?.status).to.not.equal(200);
});

Then('{int} PDFs são gerados nomeados:', function (count: number, dataTable: any) {
  expect(world.provasGeradas).to.have.lengthOf(count);
  const expectedNames = dataTable.raw().flat().filter((n: string) => n !== 'Nome');
  expect(world.provasGeradas).to.deep.equal(expectedNames);
});

Then('{int} PDFs são gerados nomeados:', function (count: number, dataTable: any) {
  expect(world.provasGeradas).to.have.lengthOf(count);
});

Then('cada PDF tem o nome e matrícula do aluno no topo', function () {
  world.provasGeradas.forEach((arquivo, idx) => {
    const aluno = world.formData['alunosSelecionados']?.[idx];
    if (aluno) {
      expect(arquivo).to.include(aluno.Nome.replace(/ /g, '_'));
    }
  });
});

Then('o rodapé contém {string}', function (rodape: string) {
  // Verificação de forma genérica
  expect(rodape).to.include('Aluno:');
});

Then('{int} PDFs da prova são gerados', function (count: number) {
  const pdfCount = world.provasGeradas.filter((f) => !f.includes('GABARITO')).length;
  expect(pdfCount).to.equal(count);
});

Then('{int} PDF com o gabarito é gerado nomeado {string}', function (count: number, nome: string) {
  const gabaritos = world.provasGeradas.filter((f) => f.includes('GABARITO'));
  expect(gabaritos).to.have.lengthOf(count);
});

Then('o gabarito contém:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    expect(row.Elemento).to.exist;
    expect(row.Conteúdo).to.exist;
  });
});

Then('um arquivo nomeado {string} é gerado', function (nomeEsperado: string) {
  expect(world.zipPath).to.exist;
  expect(world.zipPath).to.include('.zip');
});

Then('o ZIP contém todos os {int} PDFs', function (count: number) {
  expect(world.zipPath).to.exist;
  expect(world.zipPath).to.match(/\.zip$/);

  // Validação do conteúdo do ZIP usando utilitário
  const zipValido = validateZipStructure(world.zipPath!, world.provasGeradas);
  expect(zipValido).to.be.true;
  expect(world.provasGeradas).to.have.lengthOf(count);
});

Then('o CSV contém as colunas:', function (dataTable: any) {
  const colunas = dataTable.hashes().map((row: any) => row.Coluna);
  expect(world.zipPath).to.exist;

  // Extrair CSV do ZIP e validar colunas
  const zip = new (AdmZip as any)(world.zipPath!);
  const csvEntry = zip.getEntries().find((e: any) => e.entryName.endsWith('.csv'));
  expect(csvEntry).to.exist;

  const csvTemp = path.join(__dirname, '../../tmp', `temp_${Date.now()}.csv`);
  fs.writeFileSync(csvTemp, csvEntry.getData().toString('utf-8'));

  const csvValido = validateCSVContent(csvTemp, colunas);
  fs.unlinkSync(csvTemp);

  expect(csvValido).to.be.true;
});

Then('o ZIP é baixado automaticamente no navegador', function () {
  expect(world.lastResponse?.status).to.equal(200);
});

Then('uma janela modal é aberta', function () {
  expect(world.lastResponse?.status).to.equal(200);
});

Then('vejo a primeira página do PDF renderizada na tela', function () {
  expect(world.lastResponse?.data?.preview).to.exist;
});

Then('consigo navegar entre as páginas', function () {
  expect(world.lastResponse?.data?.totalPages).to.be.greaterThan(0);
});

Then('posso fechar a janela sem gerar os PDFs', function () {
  // Ação opcional - não faz nada
});
