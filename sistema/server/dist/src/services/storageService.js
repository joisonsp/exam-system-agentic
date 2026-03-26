"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarQuestoes = listarQuestoes;
exports.obterQuestao = obterQuestao;
exports.criarQuestao = criarQuestao;
exports.atualizarQuestao = atualizarQuestao;
exports.deletarQuestao = deletarQuestao;
exports.listarProvas = listarProvas;
exports.obterProva = obterProva;
exports.criarProva = criarProva;
exports.atualizarProva = atualizarProva;
exports.deletarProva = deletarProva;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const dbPath = path_1.default.join(__dirname, '../../data.json');
const initialDatabase = {
    questoes: [
        {
            id: (0, uuid_1.v4)(),
            enunciado: 'Qual é a capital do Brasil?',
            alternativas: [
                { id: 'a', descricao: 'São Paulo', correta: false },
                { id: 'b', descricao: 'Brasília', correta: true },
                { id: 'c', descricao: 'Rio de Janeiro', correta: false }
            ]
        },
        {
            id: (0, uuid_1.v4)(),
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
function readDatabase() {
    if (!fs_1.default.existsSync(dbPath)) {
        saveDatabase(initialDatabase);
        return initialDatabase;
    }
    try {
        const raw = fs_1.default.readFileSync(dbPath, 'utf-8');
        if (!raw) {
            saveDatabase(initialDatabase);
            return initialDatabase;
        }
        return JSON.parse(raw);
    }
    catch (error) {
        console.error('Falha ao ler data.json, recriando db', error);
        saveDatabase(initialDatabase);
        return initialDatabase;
    }
}
function saveDatabase(db) {
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}
function listarQuestoes() {
    const db = readDatabase();
    return db.questoes;
}
function obterQuestao(id) {
    const db = readDatabase();
    return db.questoes.find(q => q.id === id);
}
function criarQuestao(questao) {
    const db = readDatabase();
    const novaQuestao = { id: (0, uuid_1.v4)(), ...questao };
    db.questoes.push(novaQuestao);
    saveDatabase(db);
    return novaQuestao;
}
function atualizarQuestao(id, dados) {
    const db = readDatabase();
    const index = db.questoes.findIndex(q => q.id === id);
    if (index < 0)
        return undefined;
    const atualizada = { ...db.questoes[index], ...dados };
    db.questoes[index] = atualizada;
    saveDatabase(db);
    return atualizada;
}
function deletarQuestao(id) {
    const db = readDatabase();
    const inicialLength = db.questoes.length;
    db.questoes = db.questoes.filter(q => q.id !== id);
    const changed = db.questoes.length < inicialLength;
    if (changed)
        saveDatabase(db);
    return changed;
}
function listarProvas() {
    const db = readDatabase();
    return db.provas;
}
function obterProva(id) {
    const db = readDatabase();
    return db.provas.find(p => p.id === id);
}
function criarProva(prova) {
    const db = readDatabase();
    const novaProva = { id: (0, uuid_1.v4)(), ...prova };
    db.provas.push(novaProva);
    saveDatabase(db);
    return novaProva;
}
function atualizarProva(id, dados) {
    const db = readDatabase();
    const index = db.provas.findIndex(p => p.id === id);
    if (index < 0)
        return undefined;
    const atualizada = { ...db.provas[index], ...dados };
    db.provas[index] = atualizada;
    saveDatabase(db);
    return atualizada;
}
function deletarProva(id) {
    const db = readDatabase();
    const inicialLength = db.provas.length;
    db.provas = db.provas.filter(p => p.id !== id);
    const changed = db.provas.length < inicialLength;
    if (changed)
        saveDatabase(db);
    return changed;
}
