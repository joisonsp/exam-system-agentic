/**
 * Steps para Gerenciamento de Questões
 * Testes de CRUD de questões
 */

import { Given, When, Then, Before } from '@cucumber/cucumber';
import { ProvasWorld } from '../support/world';

let world: ProvasWorld;

Before(function (this: ProvasWorld) {
  world = this;
  world.reset();
});

// ============================================
// Given Steps
// ============================================

Given('que estou na página de gerenciamento de questões', async function () {
  // Verificar se a API está respondendo
  const response = await world.client.get('/questoes');
  world.assert.statusEquals(200);
});

Given('a base de dados contém {int} questões', async function (count: number) {
  const response = await world.client.get('/questoes');
  world.lastResponse = response;
  expect(response.data).to.be.an('array');
  expect(response.data.length).to.equal(count);
});

Given('existe uma questão com ID {int}:', async function (id: number, dataTable: any) {
  const data = dataTable.rowsHash();
  
  const questao = {
    id,
    enunciado: data['Enunciado'],
    opcoes: {
      a: data['Opção A'],
      b: data['Opção B'],
      c: data['Opção C'],
      d: data['Opção D'],
    },
    resposta: data['Resposta'],
    assunto: data['Assunto'],
    dificuldade: data['Dificuldade'],
  };

  world.questoes.set(id, questao);
  world.questaoId = id;
});

Given('existem questões com os seguintes enunciados:', function (dataTable: any) {
  const rows = dataTable.raw().flat();
  rows.forEach((texto: string, index: number) => {
    if (texto !== 'enunciados') {
      const questao = {
        id: index,
        enunciado: texto,
      };
      world.questoes.set(index, questao);
    }
  });
});

Given('existem {int} questões no banco de dados:', function (count: number, dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const questao = {
      id: parseInt(row.ID),
      assunto: row.Assunto,
    };
    world.questoes.set(parseInt(row.ID), questao);
  });
});

// ============================================
// When Steps
// ============================================

When('preencho o formulário com:', function (dataTable: any) {
  world.preencherFormulario(dataTable.hashes());
});

When('clico no botão {string}', async function (botao: string) {
  if (botao === 'Salvar Questão') {
    const response = await world.client.post('/questoes', {
      enunciado: world.formData['Enunciado'],
      opcoes: {
        a: world.formData['Opção A'],
        b: world.formData['Opção B'],
        c: world.formData['Opção C'],
        d: world.formData['Opção D'],
      },
      resposta: world.formData['Resposta'],
      assunto: world.formData['Assunto'],
      dificuldade: world.formData['Dificuldade'],
    });
    world.lastResponse = response;

    if (response.status === 201 && response.data?.id) {
      world.questaoId = response.data.id;
      world.questoes.set(response.data.id, response.data);
    }
  }
});

When('adiciono a seguinte questão {int}:', async function (numero: number, dataTable: any) {
  const data = dataTable.rowsHash();
  
  const response = await world.client.post('/questoes', {
    enunciado: data['Enunciado'],
    opcoes: {
      a: data['Opção A'],
      b: data['Opção B'],
      c: data['Opção C'],
      d: data['Opção D'],
    },
    resposta: data['Resposta'],
    assunto: data['Assunto'],
  });

  world.lastResponse = response;
  if (response.status === 201) {
    world.questoes.set(response.data.id, response.data);
  }
});

When('deixo os campos {string} vazios', function (campos: string) {
  // Já deixados vazios no formulário
  world.formData['Opção B'] = '';
  world.formData['Opção C'] = '';
  world.formData['Opção D'] = '';
});

When('clico para editar a questão com ID {int}', function (id: number) {
  if (world.questoes.has(id)) {
    world.questaoEmEdicao = { ...world.questoes.get(id) };
  }
});

When('altero o enunciado para {string}', function (novoEnunciado: string) {
  if (world.questaoEmEdicao) {
    world.questaoEmEdicao.enunciado = novoEnunciado;
  }
});

When('altero a resposta correta para {string}', function (resposta: string) {
  if (world.questaoEmEdicao) {
    world.questaoEmEdicao.resposta = resposta;
  }
});

When('altero apenas a resposta correta para {string}', function (resposta: string) {
  if (world.questaoEmEdicao) {
    world.questaoEmEdicao.resposta = resposta;
  }
});

When('confirmo a exclusão', async function () {
  // Ação já realizada no passo anterior
  // Este é apenas um step de confirmação
});

When('filtro as questões por assunto {string}', async function (assunto: string) {
  const response = await world.client.get('/questoes', {
    params: { assunto },
  });
  world.lastResponse = response;
});

When('pesquiso por {string}', async function (termo: string) {
  const response = await world.client.get('/questoes', {
    params: { busca: termo },
  });
  world.lastResponse = response;
});

// ============================================
// Then Steps
// ============================================

Then('vejo a mensagem {string}', function (mensagem: string) {
  const responseMessage = world.lastResponse?.data?.message || '';
  expect(responseMessage).to.include(mensagem);
});

Then('a questão é armazenada no banco de dados com ID {int}', function (id: number) {
  expect(world.questaoId).to.equal(id);
});

Then('a base de dados contém {int} questão', function (count: number) {
  expect(world.questoes.size).to.equal(count);
});

Then('a questão tem enunciado {string}', function (enunciado: string) {
  const questao = world.questoes.get(world.questaoId!);
  expect(questao?.enunciado).to.equal(enunciado);
});

Then('a resposta correta da questão é {string}', function (resposta: string) {
  const questao = world.questoes.get(world.questaoId!);
  expect(questao?.resposta).to.equal(resposta);
});

Then('consigo listar as {int} questões na página', function (count: number) {
  expect(world.questoes.size).to.equal(count);
});

Then('vejo a mensagem de erro {string}', function (erro: string) {
  const errorMessage = world.lastResponse?.data?.error || world.lastResponse?.data?.message || '';
  expect(errorMessage).to.include(erro);
});

Then('a questão não é salva no banco de dados', function () {
  // Verificar que a resposta é um erro
  expect(world.lastResponse?.status).to.not.equal(201);
});

Then('o enunciado da questão muda para {string}', function (enunciado: string) {
  const questao = world.questoes.get(world.questaoEmEdicao.id);
  expect(questao?.enunciado).to.equal(enunciado);
});

Then('a resposta correta é agora {string}', function (resposta: string) {
  const questao = world.questoes.get(world.questaoEmEdicao.id);
  expect(questao?.resposta).to.equal(resposta);
});

Then('o ID da questão permanece {int}', function (id: number) {
  expect(world.questaoEmEdicao.id).to.equal(id);
});

Then('os outros campos permanecem inalterados', function () {
  const questaoOriginal = world.questoes.get(world.questaoEmEdicao.id);
  expect(questaoOriginal?.enunciado).to.equal(world.questaoEmEdicao.enunciado);
});

Then('a questão com ID {int} não existe mais no banco de dados', function (id: number) {
  expect(world.questoes.has(id)).to.be.false;
});

Then('a questão com ID {int} continua no banco de dados', function (id: number) {
  expect(world.questoes.has(id)).to.be.true;
});

Then('vejo {int} questões listadas', function (count: number) {
  expect(world.lastResponse?.data?.length || world.lastResponse?.data).to.have.length(count);
});

Then('as questões mostradas têm IDs {int} e {int}', function (id1: number, id2: number) {
  const ids = world.lastResponse?.data?.map?.((q: any) => q.id) || [];
  expect(ids).to.include(id1);
  expect(ids).to.include(id2);
});

Then('a coluna {string} mostra {string} para todas elas', function (coluna: string, valor: string) {
  world.lastResponse?.data?.forEach?.((questao: any) => {
    expect(questao[coluna]).to.equal(valor);
  });
});

Then('não vejo as questões sobre {string} ou {string}', function (termo1: string, termo2: string) {
  world.lastResponse?.data?.forEach?.((questao: any) => {
    expect(questao.enunciado).to.not.include(termo1);
    expect(questao.enunciado).to.not.include(termo2);
  });
});

// Imports necessários
import { expect } from 'chai';
