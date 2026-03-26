/**
 * World - Contexto compartilhado entre steps
 * Armazena estado e helpers para testes de aceitação Cucumber
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { expect } from 'chai';
import { setWorldConstructor } from '@cucumber/cucumber';

export interface Questao {
  id?: number;
  enunciado?: string;
  alternativas?: Array<{ id: string; descricao: string; correta: boolean }>;
  assunto?: string;
  resposta?: string;
}

export interface Prova {
  id?: number;
  nome?: string;
  descricao?: string;
  questoes?: any;
  questoesIds?: number[];
  identificacaoAlternativas?: 'letras' | 'numeros';
  aplicadaEm?: string;
  turma?: string;
  status?: string;
}

export interface RespostaAluno {
  nomeAluno: string;
  numeroProva: number;
  respostas: string[];
}

export interface ResultadoCorrecao {
  nomeAluno?: string;
  numeroProva?: number;
  acertos?: number;
  erros?: number;
  total?: number;
  percentual?: number;
  status?: string;
  pontos?: number;
  acertosCompletos?: number;
  acertosParciais?: number;
  prova?: string;
  dataHora?: string;
  alunos?: number;
  media?: number;
}

export interface RelatorioCorrecao {
  totalAlunos: number;
  media: number;
  aprovados: number;
  reprovados: number;
}

export class ProvasWorld {
  public apiBaseUrl = 'http://localhost:4000/api';
  public client: AxiosInstance;

  public questoes: Map<number, any> = new Map();
  public questaoId: number | null = null;
  public questaoEmEdicao: any = null;

  public provas: Map<number, any> = new Map();
  public provaId: number | null = null;
  public provaEmEdicao: any = null;

  public provasDisponiveis: Array<{ id: string; nome: string }> = [];

  public provasGeradas: string[] = [];
  public metadadosProvas: Record<string, any> | null = null;
  public zipPath: string | null = null;

  public gabarito: Map<number, string[]> = new Map();
  public respostasAlunos: RespostaAluno[] = [];
  public resultadosCorrecao: ResultadoCorrecao[] = [];

  public lastResponse: AxiosResponse | null = null;
  public lastError: string | null = null;

  public formData: Record<string, any> = {};
  public tabela: Array<Record<string, any>> = [];

  constructor() {
    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      validateStatus: () => true,
    });
  }

  /**
   * Reseta o estado da World para o próximo cenário
   */
  public reset(): void {
    this.questoes.clear();
    this.questaoId = null;
    this.questaoEmEdicao = null;

    this.provas.clear();
    this.provaId = null;
    this.provaEmEdicao = null;

    this.provasDisponiveis = [];

    this.provasGeradas = [];
    this.metadadosProvas = null;
    this.zipPath = null;

    this.gabarito.clear();
    this.respostasAlunos = [];
    this.resultadosCorrecao = [];

    this.lastResponse = null;
    this.lastError = null;

    this.formData = {};
    this.tabela = [];
  }

  /**
   * Preenche os dados de formulário a partir de uma tabela Gherkin
   */
  public preencherFormulario(tabela: Array<Record<string, any>>): void {
    tabela.forEach((row) => {
      const [campo, valor] = Object.entries(row)[0];
      this.formData[campo] = valor;
    });
  }

  /**
   * Adiciona dados tabulares para validação adicional
   */
  public adicionarTabela(tabela: Array<Record<string, any>>): void {
    this.tabela = tabela;
  }

  /**
   * Asserts auxiliares para manter os steps enxutos
   */
  public assert = {
    statusEquals: (status: number) => {
      expect(this.lastResponse?.status).to.equal(status);
    },

    dataPropExists: (prop: string) => {
      expect(this.lastResponse?.data).to.have.property(prop);
    },

    dataPropEquals: (prop: string, value: any) => {
      expect(this.lastResponse?.data[prop]).to.equal(value);
    },

    messageContains: (text: string) => {
      const message = this.lastResponse?.data?.message || '';
      expect(message).to.include(text);
    },

    errorContains: (text: string) => {
      expect(this.lastError).to.include(text);
    },

    arrayLength: (array: any[], length: number) => {
      expect(array).to.have.lengthOf(length);
    },

    objectExists: (map: Map<any, any>, id: any) => {
      expect(map.has(id)).to.be.true;
    },

    objectProperty: (obj: any, prop: string, value: any) => {
      expect(obj).to.have.property(prop);
      expect(obj[prop]).to.equal(value);
    },

    resultadoExiste: (nomeAluno: string) => {
      const existe = this.resultadosCorrecao.some((r) => r.nomeAluno === nomeAluno);
      expect(existe).to.be.true;
    },

    resultadoCorrecao: (nomeAluno: string, field: string, expectedValue: any) => {
      const resultado = this.resultadosCorrecao.find((r) => r.nomeAluno === nomeAluno);
      expect(resultado).to.exist;
      expect((resultado as any)[field]).to.equal(expectedValue);
    },
  };
}

setWorldConstructor(ProvasWorld);
