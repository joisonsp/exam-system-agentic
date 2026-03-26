"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storageService_1 = require("../services/storageService");
const storageService_2 = require("../services/storageService");
const router = (0, express_1.Router)();
const validaProva = (body) => {
    const errors = [];
    if (!body || typeof body !== 'object') {
        errors.push('Corpo inválido');
        return { valid: false, errors };
    }
    if (!body.nome || typeof body.nome !== 'string') {
        errors.push('Campo nome é obrigatório e deve ser string');
    }
    if (!Array.isArray(body.questoesIds) || body.questoesIds.length === 0) {
        errors.push('Campo questoesIds é obrigatório e deve ser um array não vazio');
    }
    if (!body.identificacaoAlternativas || (body.identificacaoAlternativas !== 'letras' && body.identificacaoAlternativas !== 'potencias')) {
        errors.push('Campo identificacaoAlternativas é obrigatório e deve ser "letras" ou "potencias"');
    }
    if (body.questoesIds && Array.isArray(body.questoesIds)) {
        const existentes = new Set((0, storageService_2.listarQuestoes)().map(x => x.id));
        const invalidas = body.questoesIds.filter((id) => !existentes.has(id));
        if (invalidas.length > 0) {
            errors.push(`Questões não encontradas: ${invalidas.join(', ')}`);
        }
    }
    return { valid: errors.length === 0, errors };
};
router.get('/provas', (req, res) => {
    return res.json((0, storageService_1.listarProvas)());
});
router.get('/provas/:id', (req, res) => {
    const prova = (0, storageService_1.obterProva)(req.params.id);
    if (!prova) {
        return res.status(404).json({ error: 'Prova não encontrada' });
    }
    return res.json(prova);
});
router.post('/provas', (req, res) => {
    const { valid, errors } = validaProva(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    const prova = (0, storageService_1.criarProva)(req.body);
    return res.status(201).json(prova);
});
router.put('/provas/:id', (req, res) => {
    const { valid, errors } = validaProva(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    const prova = (0, storageService_1.atualizarProva)(req.params.id, req.body);
    if (!prova) {
        return res.status(404).json({ error: 'Prova não encontrada' });
    }
    return res.json(prova);
});
router.delete('/provas/:id', (req, res) => {
    const removed = (0, storageService_1.deletarProva)(req.params.id);
    if (!removed) {
        return res.status(404).json({ error: 'Prova não encontrada' });
    }
    return res.status(204).send();
});
exports.default = router;
