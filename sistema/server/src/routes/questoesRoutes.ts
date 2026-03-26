import { Router } from 'express';
import {
  listarQuestoes,
  obterQuestao,
  criarQuestao,
  atualizarQuestao,
  deletarQuestao
} from '../services/storageService';
import { Questao } from '../types';

const router = Router();

const validaQuestao = (body: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    errors.push('Corpo inválido');
    return { valid: false, errors };
  }

  if (!body.enunciado || typeof body.enunciado !== 'string') {
    errors.push('Campo enunciado é obrigatório e deve ser string');
  }

  if (!Array.isArray(body.alternativas) || body.alternativas.length === 0) {
    errors.push('Campo alternativas é obrigatório e deve ser um array não vazio');
  } else {
    body.alternativas.forEach((alt: any, idx: number) => {
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
  return res.json(listarQuestoes());
});

router.get('/questoes/:id', (req, res) => {
  const questao = obterQuestao(req.params.id);
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

  const questao = criarQuestao(req.body as Omit<Questao, 'id'>);
  return res.status(201).json(questao);
});

router.put('/questoes/:id', (req, res) => {
  const { valid, errors } = validaQuestao(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const questao = atualizarQuestao(req.params.id, req.body);
  if (!questao) {
    return res.status(404).json({ error: 'Questão não encontrada' });
  }
  return res.json(questao);
});

router.delete('/questoes/:id', (req, res) => {
  const removed = deletarQuestao(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Questão não encontrada' });
  }
  return res.status(204).send();
});

export default router;
