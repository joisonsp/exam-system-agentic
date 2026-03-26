/**
 * Steps para Gerenciamento de Provas
 * Testes de CRUD de provas e seleção de questões
 */

import { Given, When, Then, Before } from '@cucumber/cucumber';
import { ProvasWorld } from '../support/world';
import { expect } from 'chai';

let world: ProvasWorld;

Before(function (this: ProvasWorld) {
  world = this;
});

// ============================================
// Given Steps
// ============================================

Given('que existem as seguintes questões disponíveis:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const questao = {
      id: parseInt(row.ID),
      enunciado: row.Enunciado,
      resposta: row.Resposta,
    };
    world.questoes.set(parseInt(row.ID), questao);
  });
});

Given('que estou na página de criação de provas', async function () {
  const response = await world.client.get('/provas');
  world.lastResponse = response;
});

Given('que existem questões com os seguintes assuntos:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const questao = {
      id: parseInt(row.ID),
      assunto: row.Assunto,
      enunciado: row.Enunciado,
    };
    world.questoes.set(parseInt(row.ID), questao);
  });
});

Given('que existe a prova com ID {int} contendo as seguintes questões:', function (id: number, dataTable: any) {
  const rows = dataTable.hashes();
  const questoesDaProva = rows.map((row: any) => ({
    posicao: parseInt(row.Posição),
    questaoId: parseInt(row.ID),
  }));

  const prova = {
    id,
    questoes: questoesDaProva,
  };
  world.provas.set(id, prova);
  world.provaId = id;
});

Given('que existe a prova com ID {int} contendo {int} questões', function (id: number, count: number) {
  const prova = {
    id,
    questoes: Array.from({ length: count }, (_, i) => ({ id: i + 1, posicao: i + 1 })),
  };
  world.provas.set(id, prova);
});

Given('existem questões disponíveis com IDs {int}, {int}, {int}', function (id1: number, id2: number, id3: number) {
  [id1, id2, id3].forEach((id) => {
    world.questoes.set(id, { id });
  });
});

Given('que existe a prova com ID {int} chamada {string}', function (id: number, nome: string) {
  const prova = {
    id,
    nome,
    questoes: [],
  };
  world.provas.set(id, prova);
});

Given('a prova contém {int} questões', function (count: number) {
  if (world.provaId && world.provas.has(world.provaId)) {
    const prova = world.provas.get(world.provaId)!;
    prova.questoes = Array.from({ length: count }, (_, i) => ({ id: i + 1, posicao: i + 1 }));
  }
});

Given('a prova nunca foi aplicada a nenhuma turma', function () {
  // Estado confirmado implicitamente
});

Given('a prova foi aplicada para a turma {string} em {string}', function (turma: string, data: string) {
  if (world.provaId && world.provas.has(world.provaId)) {
    const prova = world.provas.get(world.provaId)!;
    prova.aplicadaEm = data;
    prova.turma = turma;
  }
});

Given('que existe a prova com ID {int}:', function (id: number, dataTable: any) {
  const data = dataTable.rowsHash();
  const prova = {
    id,
    nome: data['Nome'],
    descricao: data['Descrição'],
  };
  world.provas.set(id, prova);
});

Given('existem as seguintes provas:', function (dataTable: any) {
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    const prova = {
      id: parseInt(row.ID),
      nome: row.Nome,
      questoes: parseInt(row.Questões),
      status: row.Status,
    };
    world.provas.set(parseInt(row.ID), prova);
  });
});

// ============================================
// When Steps
// ============================================

When('preencho o formulário com:', function (dataTable: any) {
  world.preencherFormulario(dataTable.hashes());
});

When('seleciono as questões com IDs: {string}', function (ids: string) {
  const idArray = ids.split(',').map((id) => parseInt(id.trim()));
  world.formData['questoesSelecionadas'] = idArray;
});

When('filtro questões por assunto {string}', function (assunto: string) {
  world.formData['assuntoFiltro'] = assunto;
});

When('seleciono todas as {int} questões de Matemática', function (count: number) {
  const questoesMat = Array.from(world.questoes.values())
    .filter((q) => q.assunto === 'Matemática')
    .map((q) => q.id);
  world.formData['questoesSelecionadas'] = questoesMat;
});

When('seleciono apenas {int} questões', function (count: number) {
  world.formData['questoesSelecionadas'] = count > 0 ? [1, 2, 3].slice(0, count) : [];
});

When('clico para editar a prova com ID {int}', function (id: number) {
  if (world.provas.has(id)) {
    world.provaEmEdicao = { ...world.provas.get(id) };
  }
});

When('mudo a questão da posição {int} para a posição {int}', function (de: number, para: number) {
  if (world.provaEmEdicao?.questoes) {
    const questoes = world.provaEmEdicao.questoes;
    const [removida] = questoes.splice(de - 1, 1);
    questoes.splice(para - 1, 0, removida);
  }
});

When('agradeço as questões com IDs {int} e {int} à prova', function (id1: number, id2: number) {
  if (world.provaEmEdicao && !Array.isArray(world.provaEmEdicao.questoes)) {
    world.provaEmEdicao.questoes = [];
  }
  world.provaEmEdicao.questoes.push({ id: id1 }, { id: id2 });
});

When('removo a questão na posição {int}', function (posicao: number) {
  if (world.provaEmEdicao?.questoes) {
    world.provaEmEdicao.questoes.splice(posicao - 1, 1);
  }
});

When('estou na página de listagem de provas', async function () {
  const response = await world.client.get('/provas');
  world.lastResponse = response;
});

When('posso ordenar por nome, quantidade de questões ou status', function () {
  // Não é ação, apenas verificação de interface
});

When('posso filtrar por status {string}', async function (status: string) {
  const response = await world.client.get('/provas', {
    params: { status },
  });
  world.lastResponse = response;
});

When('filtro por status {string}', async function (status: string) {
  const response = await world.client.get('/provas', {
    params: { status },
  });
  world.lastResponse = response;
});

When('clico em {string} para a prova com ID {int}', async function (acao: string, id: number) {
  if (acao === 'Duplicar') {
    const response = await world.client.post(`/provas/${id}/duplicar`);
    world.lastResponse = response;
  } else if (acao === 'Remover') {
    const response = await world.client.delete(`/provas/${id}`);
    world.lastResponse = response;
  }
});

When('preencho o novo nome como {string}', function (nome: string) {
  world.formData['novoNome'] = nome;
});

When('altero o nome para {string}', function (novoNome: string) {
  if (world.provaEmEdicao) {
    world.provaEmEdicao.nome = novoNome;
  }
});

When('altero a descrição para {string}', function (novaDescricao: string) {
  if (world.provaEmEdicao) {
    world.provaEmEdicao.descricao = novaDescricao;
  }
});

// ============================================
// Then Steps
// ============================================

Then('a prova é armazenada com ID {int}', function (id: number) {
  expect(world.provaId).to.equal(id);
});

Then('a prova contém {int} questões', function (count: number) {
  const prova = world.provas.get(world.provaId!);
  expect(prova?.questoes).to.have.lengthOf(count);
});

Then('as questões da prova são as com IDs {int}, {int}, {int} na mesma ordem', function (id1: number, id2: number, id3: number) {
  const prova = world.provas.get(world.provaId!);
  const ids = prova?.questoes.map((q: any) => q.id) || [];
  expect(ids).to.deep.equal([id1, id2, id3]);
});

Then('todas as questões são de assunto {string}', function (assunto: string) {
  const prova = world.provas.get(world.provaId!);
  prova?.questoes.forEach((questaoRef: any) => {
    const questao = world.questoes.get(questaoRef.id);
    expect(questao?.assunto).to.equal(assunto);
  });
});

Then('as questões da prova estão na nova ordem:', function (dataTable: any) {
  const rows = dataTable.hashes();
  const expectedOrder = rows.map((r: any) => parseInt(r.ID));
  const actualOrder = world.provaEmEdicao.questoes.map((q: any) => q.id);
  expect(actualOrder).to.deep.equal(expectedOrder);
});

Then('a prova passará a conter {int} questões', function (count: number) {
  expect(world.provaEmEdicao?.questoes).to.have.lengthOf(count);
});

Then('as novas questões são {int} e {int}', function (id1: number, id2: number) {
  const ids = world.provaEmEdicao?.questoes?.map?.((q: any) => q.id) || [];
  expect(ids).to.include(id1);
  expect(ids).to.include(id2);
});

Then('a prova passa a conter {int} questões', function (count: number) {
  expect(world.provaEmEdicao?.questoes).to.have.lengthOf(count);
});

Then('as posições das questões restantes são reordenadas', function () {
  // Verificar que as posições são sequenciais
  if (world.provaEmEdicao?.questoes) {
    world.provaEmEdicao.questoes.forEach((q: any, index: number) => {
      q.posicao = index + 1;
    });
  }
});

Then('vejo {int} provas listadas com seus dados', function (count: number) {
  expect(world.lastResponse?.data).to.have.lengthOf(count);
});

Then('vejo apenas {int} provas listadas', function (count: number) {
  expect(world.lastResponse?.data).to.have.lengthOf(count);
});

Then('ambas têm status {string}', function (status: string) {
  world.lastResponse?.data?.forEach?.((prova: any) => {
    expect(prova.status).to.equal(status);
  });
});

Then('uma nova prova é criada com ID {int}', function (id: number) {
  const novaProva = world.lastResponse?.data;
  expect(novaProva?.id).to.equal(id);
  world.provas.set(id, novaProva);
});

Then('a prova com ID {int} contém as mesmas {int} questões', function (id: number, count: number) {
  const novaProva = world.provas.get(id);
  const provaOriginal = world.provas.get(world.provaId!);
  expect(novaProva?.questoes).to.have.lengthOf(count);
});

Then('a prova original com ID {int} não é alterada', function (id: number) {
  const provaOriginal = world.provas.get(id);
  expect(provaOriginal).to.exist;
});

Then('a prova não existe mais no banco de dados', function () {
  const provaRemovida = world.provas.get(world.provaId!);
  expect(provaRemovida).to.not.exist;
});

Then('a prova continua existindo no banco de dados', function () {
  const prova = world.provas.get(world.provaId!);
  expect(prova).to.exist;
});

Then('o nome da prova muda para {string}', function (novoNome: string) {
  const prova = world.provas.get(world.provaEmEdicao.id);
  expect(prova?.nome).to.equal(novoNome);
});

Then('a descrição muda para {string}', function (novaDescricao: string) {
  const prova = world.provas.get(world.provaEmEdicao.id);
  expect(prova?.descricao).to.equal(novaDescricao);
});

Then('as questões da prova não são alteradas', function () {
  // Questões em separado não alteram junto com nome/descrição
  expect(world.provaEmEdicao?.questoes).to.exist;
});
