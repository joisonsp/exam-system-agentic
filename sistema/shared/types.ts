export interface Alternativa {
  id: string;
  descricao: string;
  correta: boolean;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
}

export interface Prova {
  id: string;
  nome: string;
  questoesIds: string[];
  identificacaoAlternativas: 'letras' | 'potencias';
}

export interface GabaritoProva {
  numeroProva: number;
  respostas: string[]; // valores como 'A', 'B', 'C' ou somas/valores numéricos em string
}

export interface Correcao {
  modoRigor: 'rigoroso' | 'proporcional';
  notas: number[];
}

export interface RespostaAluno {
  numeroProva: number;
  respostas: string[]; // Ex: ['A', 'B', 'C', ...] ou ['2', '3'] para itens de soma
}

export interface CsvCorrecaoLinha {
  numeroProva: number;
  respostas: string; // linha CSV texto como A,B,C ou 3,4,5
}

export interface CsvCorrecao {
  colunas: string[];
  linhas: CsvCorrecaoLinha[];
}
