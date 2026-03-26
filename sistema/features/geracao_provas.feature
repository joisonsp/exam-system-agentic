# language: pt
Funcionalidade: Geração de Provas em PDF
  Descrição: Gerar N cópias de provas em PDF e CSV
  Como um professor
  Quero gerar múltiplas cópias de provas em PDF para distribuir aos alunos
  E um arquivo CSV com os metadados para controle

  Cenário: Gerar uma única cópia de uma prova em PDF
    Dado que existe a prova com ID 1 chamada "Prova de Ciências" contendo:
      | Posição | Enunciado                          | Opções             | Resposta |
      | 1       | O que é fotossíntese?              | A, B, C, D         | C        |
      | 2       | Qual é a capital do Brasil?        | A, B, C, D         | B        |
      | 3       | Qual é o planeta mais próximo do Sol? | A, B, C, D      | A        |
    Quando estou na página de geração de provas
    E seleciono a prova com ID 1
    E preencho:
      | Campo           | Valor |
      | Quantidade      | 1     |
    E clico em "Gerar PDF"
    Então um arquivo PDF é gerado
    E o arquivo é nomeado "Prova_de_Ciencias_001.pdf"
    E o PDF contém:
      | Elemento       | Conteúdo                                |
      | Título         | Prova de Ciências                       |
      | Questão 1      | O que é fotossíntese? [A] [B] [C] [D]  |
      | Questão 2      | Qual é a capital do Brasil? [A] [B] [C] [D] |
      | Questão 3      | Qual é o planeta... [A] [B] [C] [D]    |
      | Rodapé         | Página 1 de 1                           |

  Cenário: Gerar múltiplas cópias de uma prova com sequência numérica
    Dado que existe a prova com ID 2 chamada "Prova de Português"
    Quando estou na página de geração de provas
    E seleciono a prova com ID 2
    E preencho:
      | Campo           | Valor |
      | Quantidade      | 5     |
    E clico em "Gerar PDF"
    Então 5 arquivos PDF são gerados
    E os arquivos são nomeados:
      | Nome                            |
      | Prova_de_Portugues_001.pdf      |
      | Prova_de_Portugues_002.pdf      |
      | Prova_de_Portugues_003.pdf      |
      | Prova_de_Portugues_004.pdf      |
      | Prova_de_Portugues_005.pdf      |
    E cada PDF contém as mesmas questões, porém numeradas de 001 a 005

  Cenário: Gerar prova com embaralhamento de questões
    Dado que existe a prova com ID 3 com as seguintes questões:
      | Posição | ID |
      | 1       | 1  |
      | 2       | 2  |
      | 3       | 3  |
    E as questões originais estão nesta ordem
    Quando estou na página de geração de provas
    E seleciono a prova com ID 3
    E ativo a opção "Embaralhar questões"
    E preencho:
      | Campo           | Valor |
      | Quantidade      | 3     |
    E clico em "Gerar PDF"
    Então 3 PDFs são gerados
    E cada PDF contém as mesmas 3 questões em ordem diferente
    E a ordem das questões é diferente em pelo menos 2 dos 3 PDFs

  Cenário: Gerar prova com embaralhamento de opções de resposta
    Dado que existe a prova com ID 4
    Quando estou na página de geração de provas
    E seleciono a prova com ID 4
    E ativo a opção "Embaralhar opções"
    E preencho:
      | Campo           | Valor |
      | Quantidade      | 2     |
    E clico em "Gerar PDF"
    Então 2 PDFs são gerados
    E em cada questão, as alternativas A, B, C, D estão em ordem diferente
    E pelo menos um PDF tem as opções de uma questão em ordem diferente do outro

  Cenário: Exportar metadados das provas geradas em CSV
    Dado que geramos 3 cópias da prova "Prova de Ciências"
    Quando clico em "Exportar CSV com Metadados"
    Então um arquivo CSV é gerado nomeado "Prova_de_Ciencias_metadata_202603251400.csv"
    E o CSV contém as colunas:
      | Coluna          | Conteúdo                     |
      | ID_Prova        | 1                            |
      | Nome_Prova      | Prova de Ciências            |
      | Numero_Copia    | 001, 002, 003                |
      | Data_Geracao    | 25/03/2026                   |
      | Quantidade_Questoes | 3                        |
      | Arquivo_PDF     | Prova_de_Ciencias_001.pdf... |

  Cenário: Validar quantidade máxima de cópias
    Dado que estou na página de geração de provas
    Quando seleciono uma prova
    E preencho:
      | Campo           | Valor  |
      | Quantidade      | 1000   |
    E clico em "Gerar PDF"
    Então vejo mensagem de aviso "Quantidade muito grande. Máximo de 500 cópias por vez."
    E os PDFs não são gerados
    E sou redirecionado para corrigir a quantidade

  Cenário: Gerar prova com numeração personalizada
    Dado que existe a prova com ID 5
    Quando estou na página de geração de provas
    E seleciono a prova com ID 5
    E ativoOpção "Numeração Personalizada"
    E preencho:
      | Campo              | Valor |
      | Número Inicial     | 100   |
      | Quantidade         | 3     |
    E clico em "Gerar PDF"
    Então 3 PDFs são gerados nomeados:
      | Nome                        |
      | Prova_de_[Nome]_100.pdf     |
      | Prova_de_[Nome]_101.pdf     |
      | Prova_de_[Nome]_102.pdf     |

  Cenário: Gerar provas com informações do aluno
    Dado que tenho uma lista de 5 alunos:
      | ID | Nome           | Matrícula |
      | 1  | João Silva     | M001      |
      | 2  | Maria Santos   | M002      |
      | 3  | Pedro Oliveira | M003      |
      | 4  | Ana Costa      | M004      |
      | 5  | Lucas Pereira  | M005      |
    E existe a prova com ID 6 chamada "Avaliação Final"
    Quando estou na página de geração de provas
    E seleciono a prova com ID 6
    E ativo a opção "Gerar com Nomes de Alunos"
    E seleciono os 5 alunos
    E clico em "Gerar PDF"
    Então 5 PDFs são gerados nomeados:
      | Nome                                   |
      | Avaliacao_Final_Joao_Silva_M001.pdf    |
      | Avaliacao_Final_Maria_Santos_M002.pdf  |
      | Avaliacao_Final_Pedro_Oliveira_M003.pdf |
      | Avaliacao_Final_Ana_Costa_M004.pdf     |
      | Avaliacao_Final_Lucas_Pereira_M005.pdf |
    E cada PDF tem o nome e matrícula do aluno no topo
    E o rodapé contém "Aluno: [Nome] - Matrícula: [Matrícula]"

  Cenário: Gerar prova com gabarito separado
    Dado que existe a prova com ID 7 com 3 questões
    Quando estou na página de geração de provas
    E seleciono a prova com ID 7
    E ativo a opção "Gerar Gabarito Separado"
    E preencho:
      | Campo           | Valor |
      | Quantidade      | 2     |
    E clico em "Gerar PDF"
    Então 2 PDFs da prova são gerados
    E 1 PDF com o gabarito é gerado nomeado "Prova_de_[Nome]_GABARITO.pdf"
    E o gabarito contém:
      | Elemento       | Conteúdo           |
      | Título         | GABARITO OFICIAL   |
      | Questão 1      | Resposta: A        |
      | Questão 2      | Resposta: C        |
      | Questão 3      | Resposta: B        |

  Cenário: Baixar todos os PDFs gerados como arquivo ZIP
    Dado que geramos 5 cópias de uma prova
    E todos os PDFs foram gerados com sucesso
    Quando clico em "Baixar Todos como ZIP"
    Então um arquivo nomeado "Prova_de_[Nome]_20260325.zip" é gerado
    E o ZIP contém todos os 5 PDFs
    E o ZIP é baixado automaticamente no navegador

  Cenário: Visualizar prévia do PDF antes de gerar
    Dado que estou na página de geração de provas
    E seleciono a prova com ID 8
    Quando clico em "Visualizar Prévia"
    Então uma janela modal é aberta
    E vejo a primeira página do PDF renderizada na tela
    E consigo navegar entre as páginas
    E posso fechar a janela sem gerar os PDFs
