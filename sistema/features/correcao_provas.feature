# language: pt
Funcionalidade: Correção de Provas
  Descrição: Corrigir provas nos dois modos e gerar relatório detalhado
  Como um professor
  Quero corrigir as respostas dos alunos de forma automática
  E obter um relatório com análise de desempenho

  Cenário: Corrigir prova em modo Rigoroso
    Dado que existe um arquivo "gabarito.csv" com o seguinte conteúdo:
      | numeroProva | respostas |
      | 1           | A,B,C,D   |
      | 2           | B,A,C,B   |
    E existe um arquivo "respostas.csv" com o seguinte conteúdo:
      | nomeAluno    | numeroProva | respostas |
      | João Silva   | 1           | A,B,C,D   |
      | Maria Santos | 1           | A,B,C,A   |
      | Pedro Lima   | 2           | B,A,C,B   |
      | Ana Costa    | 2           | B,A,C,A   |
    Quando estou na página de correção de provas
    E seleciono "gabarito.csv"
    E seleciono "respostas.csv"
    E mantenho o modo padrão "Rigoroso"
    E clico em "Corrigir Provas"
    Então a correção é executada
    E os resultados mostram:
      | nomeAluno    | prova | acertos | total | percentual | status      |
      | João Silva   | 1     | 4       | 4     | 100%       | Excelente   |
      | Maria Santos | 1     | 3       | 4     | 75%        | Bom         |
      | Pedro Lima   | 2     | 4       | 4     | 100%       | Excelente   |
      | Ana Costa    | 2     | 3       | 4     | 75%        | Bom         |
    E no modo rigoroso:
      | João Silva   | Acertos: 4 questões (100%) |
      | Maria Santos | Acertos: 3 questões (75%)  |

  Cenário: Corrigir prova em modo Proporcional
    Dado que existe um gabarito com as questões:
      | Prova | Questão 1 | Questão 2 | Questão 3 | Questão 4 |
      | 1     | A         | B         | C         | D         |
    E exists um arquivo de respostas com:
      | Aluno        | Prova | Respostas     |
      | João Silva   | 1     | A,B,C,D       |
      | Maria Santos | 1     | A,B,D,C       |
    Quando estou na página de correção de provas
    E seleciono o gabarito
    E seleciono as respostas
    E mudo para modo "Proporcional"
    E clico em "Corrigir Provas"
    Então a correção ocorre com pontuação proporcional:
      | Aluno        | Acertos | Parciários | Erros | Pontos | Percentual |
      | João Silva   | 4       | 0          | 0     | 10     | 100%       |
      | Maria Santos | 2       | 0          | 2     | 5      | 50%        |

  Cenário: Corrigir prova com questões de múltipla seleção
    Dado que existe um gabarito com questões de múltipla seleção:
      | NumeroProva | Questão | Respostas     |
      | 1           | 1       | A,C,D         |
      | 1           | 2       | B,D           |
      | 1           | 3       | A             |
    E existe um arquivo de respostas:
      | nomeAluno    | numeroProva | respostas           |
      | João Silva   | 1           | A,C,D / B,D / A     |
      | Maria Santos | 1           | A,C / B,D / A       |
      | Pedro Lima   | 1           | A,C,D / B,C,D / A   |
    Quando estou na página de correção
    E seleciono os arquivos
    E clico em "Corrigir Provas"
    Então os resultados mostram:
      | nomeAluno    | acertos_completos | acertos_parciais | erros |
      | João Silva   | 3                 | 0                | 0     |
      | Maria Santos | 2                 | 1                | 0     |
      | Pedro Lima   | 1                 | 1                | 1     |

  Cenário: Validar formato de arquivo CSV do gabarito
    Dado que estou na página de correção de provas
    Quando seleciono um arquivo errado nomeado "dados_invalidos.csv"
    E o arquivo tem o seguinte conteúdo (formato errado):
      | nomeProva | alternativas |
      | Prova 1   | A,B,C,D      |
    E clico em "Corrigir Provas"
    Então vejo mensagem de erro "Formato de gabarito inválido. Esperado: numeroProva, respostas"
    E as provas não são corrigidas

  Cenário: Validar correspondência entre prova e respostas
    Dado que existe um gabarito com provas 1 e 2
    E arquivo de respostas referencia apenas prova 1
    Quando estou na página de correção
    E seleciono os arquivos
    E clico em "Corrigir Provas"
    Então vejo mensagem de aviso "Nenhuma resposta encontrada para a prova: 2"
    E os resultados mostram apenas os alunos que responderam prova 1

  Cenário: Gerar relatório com estatísticas gerais
    Dado que 10 alunos responderam a uma prova
    E os percentuais de acerto foram: 100, 95, 90, 85, 80, 75, 70, 65, 60, 55
    Quando clico em "Gerar Relatório"
    Então um relatório é gerado contendo:
      | Métrica              | Valor |
      | Total de Alunos      | 10    |
      | Média da Turma       | 77.5% |
      | Mediana              | 75%   |
      | Moda                 | N/A   |
      | Maior Nota           | 100%  |
      | Menor Nota           | 55%   |
      | Desvio Padrão        | ~14%  |
      | Alunos Aprovados     | 8     |
      | Alunos Reprovados    | 2     |

  Cenário: Corrigir provas e baixar resultado em CSV
    Dado que corrigi 5 provas com sucesso
    E os resultados estão na tela
    Quando clico em "Baixar Resultado CSV"
    Então um arquivo nomeado "resultados_correcao_20260325_1400.csv" é baixado
    E o CSV contém as colunas:
      | Coluna      | Exemplo        |
      | nomeAluno   | João Silva     |
      | numeroProva | 1              |
      | acertos     | 4              |
      | erros       | 0              |
      | total       | 4              |
      | percentual  | 100%           |
      | status      | Excelente      |
    E cada linha representa um aluno com seus resultados

  Cenário: Corrigir provas de diferentes números
    Dado que existe um gabarito com 3 provas:
      | numeroProva | respostas |
      | 1           | A,B,C,D   |
      | 2           | B,A,C,B   |
      | 3           | C,C,A,B   |
    E arquivo de respostas com alunos respondendo diferentes provas:
      | nomeAluno    | numeroProva | respostas |
      | João Silva   | 1           | A,B,C,D   |
      | Maria Santos | 2           | B,A,C,B   |
      | Pedro Lima   | 3           | C,C,A,B   |
      | Ana Costa    | 1           | A,B,D,D   |
    Quando estou na página de correção
    E clico em "Corrigir Provas"
    Então a correção agrupa os resultados por número de prova:
      | Prova 1          | João Silva (100%), Ana Costa (75%)     |
      | Prova 2          | Maria Santos (100%)                    |
      | Prova 3          | Pedro Lima (100%)                      |

  Cenário: Rejeitar arquivo com dados incompletos
    Dado que tenho um arquivo de respostas incompleto:
      | nomeAluno  | numeroProva | respostas |
      | João Silva | 1           |           |
      | Maria      | 2           | B,A,C,B   |
    E um campo "respostas" está vazio para João Silva
    Quando clico em "Corrigir Provas"
    Então vejo mensagem de erro "Erro na linha 1: Campo 'respostas' não pode estar vazio"
    E as provas não são corrigidas
    E posso corrigir o arquivo e tentar novamente

  Cenário: Corrigir provas com nomes de alunos variados
    Dado que tenho um arquivo com nomes em diferentes formatos:
      | nomeAluno                    | numeroProva | respostas |
      | João Silva                   | 1           | A,B,C,D   |
      | MARIA SANTOS DOS SANTOS      | 1           | A,B,C,B   |
      | pedro-oliveira               | 1           | A,B,C,D   |
      | ANA_COSTA_123                | 1           | B,A,C,D   |
    Quando clico em "Corrigir Provas"
    Então a correção funciona corretamente
    E os nomes aparecem no relatório mantendo o formato original
    E os resultados são calculados corretamente para todos

  Cenário: Gerar gráfico de desempenho por questão
    Dado que corrigi provas de 20 alunos
    Quando clico em "Gerar Gráfico de Desempenho"
    Então um gráfico de barras é gerado mostrando:
      | Questão | Acertos | Taxa Acerto |
      | Q1      | 18      | 90%         |
      | Q2      | 15      | 75%         |
      | Q3      | 12      | 60%         |
      | Q4      | 19      | 95%         |
    E o gráfico identifica questões com baixo desempenho (< 50%)
    E oferece exportar o gráfico como imagem PNG

  Cenário: Comparar desempenho entre duas turmas
    Dado que existem resultados de correção para:
      | Turma   | Total Alunos | Média |
      | 1º Ano A | 25          | 78%   |
      | 1º Ano B | 22          | 82%   |
    Quando clico em "Comparar Turmas"
    Então uma tabela comparativa é exibida:
      | Métrica              | 1º Ano A | 1º Ano B |
      | Total de Alunos      | 25       | 22       |
      | Média da Turma       | 78%      | 82%      |
      | Alunos Aprovados     | 20       | 19       |
      | Taxa Aprovação       | 80%      | 86.4%    |
      | Maior Nota           | 100%     | 100%     |
      | Menor Nota           | 45%      | 52%      |
    E posso exportar a comparação em PDF ou Excel

  Cenário: Corrigir mesma prova múltiplas vezes e ver histórico
    Dado que corrigi a prova "Avaliação Final" em 25/03/2026 às 10:00
    E agora corrijo a mesma prova em 25/03/2026 às 14:00 com alunos diferentes
    Quando acesso o "Histórico de Correções"
    Então vejo duas correções listadas:
      | Data/Hora           | Prova             | Alunos | Média |
      | 25/03/2026 10:00    | Avaliação Final   | 30     | 75%   |
      | 25/03/2026 14:00    | Avaliação Final   | 28     | 78%   |
    E posso clicar em cada uma para ver os detalhes completos
