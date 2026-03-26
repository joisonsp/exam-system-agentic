"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const storageService_1 = require("./services/storageService");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Questões
app.get('/questoes', (req, res) => {
    res.json((0, storageService_1.listarQuestoes)());
});
app.get('/questoes/:id', (req, res) => {
    const questao = (0, storageService_1.obterQuestao)(req.params.id);
    if (!questao)
        return res.status(404).json({ error: 'Questão não encontrada' });
    res.json(questao);
});
app.post('/questoes', (req, res) => {
    const questao = (0, storageService_1.criarQuestao)(req.body);
    res.status(201).json(questao);
});
app.put('/questoes/:id', (req, res) => {
    const questao = (0, storageService_1.atualizarQuestao)(req.params.id, req.body);
    if (!questao)
        return res.status(404).json({ error: 'Questão não encontrada' });
    res.json(questao);
});
app.delete('/questoes/:id', (req, res) => {
    const ok = (0, storageService_1.deletarQuestao)(req.params.id);
    if (!ok)
        return res.status(404).json({ error: 'Questão não encontrada' });
    res.status(204).send();
});
// Provas
app.get('/provas', (req, res) => {
    res.json((0, storageService_1.listarProvas)());
});
app.get('/provas/:id', (req, res) => {
    const prova = (0, storageService_1.obterProva)(req.params.id);
    if (!prova)
        return res.status(404).json({ error: 'Prova não encontrada' });
    res.json(prova);
});
app.post('/provas', (req, res) => {
    const prova = (0, storageService_1.criarProva)(req.body);
    res.status(201).json(prova);
});
app.put('/provas/:id', (req, res) => {
    const prova = (0, storageService_1.atualizarProva)(req.params.id, req.body);
    if (!prova)
        return res.status(404).json({ error: 'Prova não encontrada' });
    res.json(prova);
});
app.delete('/provas/:id', (req, res) => {
    const ok = (0, storageService_1.deletarProva)(req.params.id);
    if (!ok)
        return res.status(404).json({ error: 'Prova não encontrada' });
    res.status(204).send();
});
app.post('/upload-csv', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});
app.get('/download-pdf', (req, res) => {
    const doc = new pdfkit_1.default();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="prova.pdf"');
    doc.text('Exemplo de prova gerada em PDF');
    doc.end();
    doc.pipe(res);
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
