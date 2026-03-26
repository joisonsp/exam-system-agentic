import { Router } from 'express';
import { obterProva, listarQuestoes } from '../services/storageService';
import { generateProvasAndGabarito } from '../services/provaGeneratorService';
import { Prova } from '../types';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const router = Router();

interface GerarProvasRequest {
  provaId: string;
  quantidade: number;
  professor?: string;
  disciplina?: string;
}

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Armazena referências de downloads ativos
const generatedFiles: Map<string, { gabarito: string; provas: Buffer[]; createdAt: number }> = new Map();

// Limpa arquivos antigos a cada 30 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of generatedFiles.entries()) {
    if (now - value.createdAt > 30 * 60 * 1000) {
      generatedFiles.delete(key);
    }
  }
}, 30 * 60 * 1000);

router.post('/gerar-provas', async (req, res) => {
  try {
    const { provaId, quantidade, professor, disciplina } = req.body as GerarProvasRequest;

    if (!provaId || typeof provaId !== 'string') {
      return res.status(400).json({ error: 'provaId é obrigatório' });
    }

    if (!quantidade || typeof quantidade !== 'number' || quantidade < 1 || quantidade > 1000) {
      return res.status(400).json({ error: 'quantidade deve ser um número entre 1 e 1000' });
    }

    const prova = obterProva(provaId) as Prova | undefined;
    if (!prova) {
      return res.status(404).json({ error: 'Prova não encontrada' });
    }

    const todasQuestoes = listarQuestoes();
    if (todasQuestoes.length === 0) {
      return res.status(400).json({ error: 'Nenhuma questão disponível' });
    }

    const missingQuestoes = prova.questoesIds.filter((id) => !todasQuestoes.some((q) => q.id === id));
    if (missingQuestoes.length > 0) {
      return res.status(400).json({ error: `Questões não encontradas: ${missingQuestoes.join(', ')}` });
    }

    const { gabarito, provas } = await generateProvasAndGabarito(
      prova,
      quantidade,
      todasQuestoes,
      professor ?? 'Professor Não Informado',
      disciplina ?? 'Disciplina Não Informada'
    );

    const zip = new AdmZip();

    provas.forEach((buffer, index) => {
      zip.addFile(`prova_${String(index + 1).padStart(3, '0')}.pdf`, buffer);
    });

    zip.addFile('gabaritos.csv', Buffer.from(gabarito, 'utf8'));

    const zipBuffer = zip.toBuffer();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="provas_geradas.zip"');
    return res.status(200).send(zipBuffer);
  } catch (error) {
    console.error('Erro ao gerar provas:', error);
    return res.status(500).json({
      error: 'Erro ao gerar provas: ' + (error instanceof Error ? error.message : 'desconhecido')
    });
  }
});

// Endpoint para baixar uma prova específica
router.get('/baixar-provas/:generationId/:provaNumber', async (req, res) => {
  try {
    const { generationId, provaNumber } = req.params;
    const provaIdx = parseInt(provaNumber, 10);

    const generation = generatedFiles.get(generationId);
    if (!generation) {
      return res.status(404).json({ error: 'Geração não encontrada ou expirou' });
    }

    if (provaIdx < 1 || provaIdx > generation.provas.length) {
      return res.status(400).json({ error: 'Número da prova inválido' });
    }

    const pdfBuffer = generation.provas[provaIdx - 1];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="prova_${provaNumber}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao baixar prova:', error);
    return res.status(500).json({
      error: 'Erro ao baixar prova: ' + (error instanceof Error ? error.message : 'desconhecido')
    });
  }
});

// Endpoint para baixar o gabarito
router.get('/baixar-gabarito/:generationId', async (req, res) => {
  try {
    const { generationId } = req.params;

    const generation = generatedFiles.get(generationId);
    if (!generation) {
      return res.status(404).json({ error: 'Geração não encontrada ou expirou' });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="gabarito.csv"');
    return res.send(generation.gabarito);
  } catch (error) {
    console.error('Erro ao baixar gabarito:', error);
    return res.status(500).json({
      error: 'Erro ao baixar gabarito: ' + (error instanceof Error ? error.message : 'desconhecido')
    });
  }
});

export default router;
