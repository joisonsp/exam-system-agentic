"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const questoesRoutes_1 = __importDefault(require("./routes/questoesRoutes"));
const provasRoutes_1 = __importDefault(require("./routes/provasRoutes"));
const geraProvasRoutes_1 = __importDefault(require("./routes/geraProvasRoutes"));
const correcaoRoutes_1 = __importDefault(require("./routes/correcaoRoutes"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api', questoesRoutes_1.default);
app.use('/api', provasRoutes_1.default);
app.use('/api', geraProvasRoutes_1.default);
app.use('/api', correcaoRoutes_1.default);
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
const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});
