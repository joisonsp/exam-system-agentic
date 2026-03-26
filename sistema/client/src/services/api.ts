import axios, { AxiosInstance } from 'axios';
import {
  Questao,
  Prova,
  GabaritoProva,
  Correcao,
  RespostaAluno
} from '@shared/types';

const API_BASE_URL = 'http://localhost:4000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ QUESTÕES ============

export const getQuestoes = async (): Promise<Questao[]> => {
  const response = await client.get<Questao[]>('/questoes');
  return response.data;
};

export const getQuestao = async (id: string): Promise<Questao> => {
  const response = await client.get<Questao>(`/questoes/${id}`);
  return response.data;
};

export const createQuestao = async (questao: Omit<Questao, 'id'>): Promise<Questao> => {
  const response = await client.post<Questao>('/questoes', questao);
  return response.data;
};

export const updateQuestao = async (id: string, questao: Partial<Omit<Questao, 'id'>>): Promise<Questao> => {
  const response = await client.put<Questao>(`/questoes/${id}`, questao);
  return response.data;
};

export const deleteQuestao = async (id: string): Promise<void> => {
  await client.delete(`/questoes/${id}`);
};

// ============ PROVAS ============

export const getProvas = async (): Promise<Prova[]> => {
  const response = await client.get<Prova[]>('/provas');
  return response.data;
};

export const getProva = async (id: string): Promise<Prova> => {
  const response = await client.get<Prova>(`/provas/${id}`);
  return response.data;
};

export const createProva = async (prova: Omit<Prova, 'id'>): Promise<Prova> => {
  const response = await client.post<Prova>('/provas', prova);
  return response.data;
};

export const updateProva = async (id: string, prova: Partial<Omit<Prova, 'id'>>): Promise<Prova> => {
  const response = await client.put<Prova>(`/provas/${id}`, prova);
  return response.data;
};

export const deleteProva = async (id: string): Promise<void> => {
  await client.delete(`/provas/${id}`);
};

export const gerarProvasZip = async (provaId: string, quantidade: number, professor?: string, disciplina?: string): Promise<Blob> => {
  const response = await client.post('/gerar-provas', {
    provaId,
    quantidade,
    professor,
    disciplina,
  }, {
    responseType: 'blob',
  });
  return response.data as Blob;
};

// ============ UTILITÁRIOS ============

export interface ResultadoCorrecao {
  nomeAluno: string;
  numeroProva: number;
  acertos: number;
  total: number;
  percentual: number;
  status: string;
}

export const corrigirProvas = async (
  gabaritoFile: File,
  respostasFile: File,
  modo: 'rigoroso' | 'proporcional' = 'rigoroso'
): Promise<{
  success: boolean;
  message: string;
  modo: string;
  resultados: ResultadoCorrecao[];
  csv: string;
}> => {
  const formData = new FormData();
  formData.append('gabarito', gabaritoFile);
  formData.append('respostas', respostasFile);

  const response = await client.post('/corrigir', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { modo }
  });

  return response.data;
};

export const downloadResultadosCSV = async (
  gabaritoFile: File,
  respostasFile: File,
  modo: 'rigoroso' | 'proporcional' = 'rigoroso'
): Promise<void> => {
  const formData = new FormData();
  formData.append('gabarito', gabaritoFile);
  formData.append('respostas', respostasFile);

  const response = await client.post('/corrigir', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { modo, download: 'true' },
    responseType: 'blob'
  });

  // Create download link
  const url = window.URL.createObjectURL(response.data as Blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resultados_correcao_${new Date().getTime()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default client;
