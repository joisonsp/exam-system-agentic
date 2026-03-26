import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Prova, Questao } from '../types';

const dbPath = path.join(__dirname, '../../data.json');

interface Database {
  questoes: Questao[];
  provas: Prova[];
}

const initialDatabase: Database = {
  questoes: [
    {
      id: uuidv4(),
      enunciado: 'Qual é a capital do Brasil?',
      alternativas: [
        { id: 'a', descricao: 'São Paulo', correta: false },
        { id: 'b', descricao: 'Brasília', correta: true },
        { id: 'c', descricao: 'Rio de Janeiro', correta: false }
      ]
    },
    {
      id: uuidv4(),
      enunciado: '2 + 2 = ?',
      alternativas: [
        { id: 'a', descricao: '3', correta: false },
        { id: 'b', descricao: '4', correta: true },
        { id: 'c', descricao: '5', correta: false }
      ]
    }
  ],
  provas: []
};

function readDatabase(): Database {
  if (!fs.existsSync(dbPath)) {
    saveDatabase(initialDatabase);
    return initialDatabase;
  }

  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    if (!raw) {
      saveDatabase(initialDatabase);
      return initialDatabase;
    }
    return JSON.parse(raw) as Database;
  } catch (error) {
    console.error('Falha ao ler data.json, recriando db', error);
    saveDatabase(initialDatabase);
    return initialDatabase;
  }
}

function saveDatabase(db: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export function listarQuestoes(): Questao[] {
  const db = readDatabase();
  return db.questoes;
}

export function obterQuestao(id: string): Questao | undefined {
  const db = readDatabase();
  return db.questoes.find(q => q.id === id);
}

export function criarQuestao(questao: Omit<Questao, 'id'>): Questao {
  const db = readDatabase();
  const novaQuestao: Questao = { id: uuidv4(), ...questao };
  db.questoes.push(novaQuestao);
  saveDatabase(db);
  return novaQuestao;
}

export function atualizarQuestao(id: string, dados: Partial<Omit<Questao, 'id'>>): Questao | undefined {
  const db = readDatabase();
  const index = db.questoes.findIndex(q => q.id === id);
  if (index < 0) return undefined;
  const atualizada = { ...db.questoes[index], ...dados };
  db.questoes[index] = atualizada;
  saveDatabase(db);
  return atualizada;
}

export function deletarQuestao(id: string): boolean {
  const db = readDatabase();
  const inicialLength = db.questoes.length;
  db.questoes = db.questoes.filter(q => q.id !== id);
  const changed = db.questoes.length < inicialLength;
  if (changed) saveDatabase(db);
  return changed;
}

export function listarProvas(): Prova[] {
  const db = readDatabase();
  return db.provas;
}

export function obterProva(id: string): Prova | undefined {
  const db = readDatabase();
  return db.provas.find(p => p.id === id);
}

export function criarProva(prova: Omit<Prova, 'id'>): Prova {
  const db = readDatabase();
  const novaProva: Prova = { id: uuidv4(), ...prova };
  db.provas.push(novaProva);
  saveDatabase(db);
  return novaProva;
}

export function atualizarProva(id: string, dados: Partial<Omit<Prova, 'id'>>): Prova | undefined {
  const db = readDatabase();
  const index = db.provas.findIndex(p => p.id === id);
  if (index < 0) return undefined;
  const atualizada = { ...db.provas[index], ...dados };
  db.provas[index] = atualizada;
  saveDatabase(db);
  return atualizada;
}

export function deletarProva(id: string): boolean {
  const db = readDatabase();
  const inicialLength = db.provas.length;
  db.provas = db.provas.filter(p => p.id !== id);
  const changed = db.provas.length < inicialLength;
  if (changed) saveDatabase(db);
  return changed;
}
