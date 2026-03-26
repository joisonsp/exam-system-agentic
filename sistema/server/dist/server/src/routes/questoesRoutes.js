"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storageService_1 = require("../services/storageService");
const router = (0, express_1.Router)();
const validaQuestao = (body) => {
    const errors = [];
    if (!body || typeof body !== 'object') {
        errors.push('Corpo inválido');
        return { valid: false, errors };
    }
    if (!body.enunciado || typeof body.enunciado !== 'string') {
        errors.push('Campo enunciado é obrigatório e deve ser string');
    }
    if (!Array.isArray(body.alternativas) || body.alternativas.length === 0) {
        errors.push('Campo alternativas é obrigatório e deve ser um array não vazio');
    }
    else {
        body.alternativas.forEach((alt, idx) => {
            if (!alt || typeof alt !== 'object') {
                errors.push(`Alternativa[${idx}] inválida`);
                return;
            }
            if (!alt.id || typeof alt.id !== 'string') {
                errors.push(`Alternativa[${idx}].id é obrigatório e deve ser string`);
            }
            if (!alt.descricao || typeof alt.descricao !== 'string') {
                errors.push(`Alternativa[${idx}].descricao é obrigatório e deve ser string`);
            }
            if (typeof alt.correta !== 'boolean') {
                errors.push(`Alternativa[${idx}].correta é obrigatório e deve ser boolean`);
            }
        });
    }
    return { valid: errors.length === 0, errors };
};
router.get('/questoes', (req, res) => {
    return res.json((0, storageService_1.listarQuestoes)());
});
router.get('/questoes/:id', (req, res) => {
    const questao = (0, storageService_1.obterQuestao)(req.params.id);
    if (!questao) {
        return res.status(404).json({ error: 'Questão não encontrada' });
    }
    return res.json(questao);
});
router.post('/questoes', (req, res) => {
    const { valid, errors } = validaQuestao(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    const questao = (0, storageService_1.criarQuestao)(req.body);
    return res.status(201).json(questao);
});
router.put('/questoes/:id', (req, res) => {
    const { valid, errors } = validaQuestao(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    const questao = (0, storageService_1.atualizarQuestao)(req.params.id, req.body);
    if (!questao) {
        return res.status(404).json({ error: 'Questão não encontrada' });
    }
    return res.json(questao);
});
router.delete('/questoes/:id', (req, res) => {
    const removed = (0, storageService_1.deletarQuestao)(req.params.id);
    if (!removed) {
        return res.status(404).json({ error: 'Questão não encontrada' });
    }
    return res.status(204).send();
});
exports.default = router;
