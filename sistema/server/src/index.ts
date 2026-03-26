import express from 'express';
import cors from 'cors';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import questoesRoutes from './routes/questoesRoutes';
import provasRoutes from './routes/provasRoutes';
import geraProvasRoutes from './routes/geraProvasRoutes';
import correcaoRoutes from './routes/correcaoRoutes';
import {
  listarProvas,
  obterProva,
  criarProva,
  atualizarProva,
  deletarProva
} from './services/storageService';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', questoesRoutes);
app.use('/api', provasRoutes);
app.use('/api', geraProvasRoutes);
app.use('/api', correcaoRoutes);


app.post('/upload-csv', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.get('/download-pdf', (req, res) => {
  const doc = new PDFDocument();
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
