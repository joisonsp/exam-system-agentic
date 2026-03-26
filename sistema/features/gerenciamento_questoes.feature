# language: pt
Funcionalidade: Gerenciamento de Questões
  Descrição: Gerenciar questões de múltipla escolha
  Como um professor
  Quero criar, alterar e remover questões
  Para organizar as questões que serão usadas nas provas

  Cenário: Incluir uma nova questão com sucesso
    Dado que estou na página de gerenciamento de questões
    E a base de dados contém 0 questões
    Quando preencho o formulário com:
      | Campo      | Valor                        |
      | Enunciado  | O que é fotossíntese?        |
      | Opção A    | Processo de digestão         |
      | Opção B    | Processo de respiração       |
      | Opção C    | Processo de produção de energia |
      | Opção D    | Processo de decomposição     |
      | Resposta   | C                            |
      | Assunto    | Biologia                     |
      | Dificuldade| Médio                        |
    E clico no botão "Salvar Questão"
    Então vejo a mensagem "Questão criada com sucesso!"
    E a questão é armazenada no banco de dados com ID 1
    E a base de dados contém 1 questão
    E a questão tem enunciado "O que é fotossíntese?"
    E a resposta correta da questão é "C"

  Cenário: Incluir múltiplas questões em sequência
    Dado que estou na página de gerenciamento de questões
    Quando adiciono a seguinte questão 1:
      | Enunciado  | Qual é a capital do Brasil? |
      | Opção A    | São Paulo                   |
      | Opção B    | Brasília                    |
      | Opção C    | Rio de Janeiro              |
      | Opção D    | Salvador                    |
      | Resposta   | B                           |
      | Assunto    | Geografia                   |
    E adiciono a seguinte questão 2:
      | Enunciado  | Qual é 2 + 2?               |
      | Opção A    | 3                           |
      | Opção B    | 4                           |
      | Opção C    | 5                           |
      | Opção D    | 6                           |
      | Resposta   | B                           |
      | Assunto    | Matemática                  |
    E adiciono a seguinte questão 3:
      | Enunciado  | Qual foi o primeiro presidente? |
      | Opção A    | Getúlio Vargas              |
      | Opção B    | Deodoro da Fonseca          |
      | Opção C    | Custódio José Ribeiro      |
      | Opção D    | Prudente de Morais          |
      | Resposta   | B                           |
      | Assunto    | História                    |
    Então a base de dados contém 3 questões
    E consigo listar as 3 questões na página

  Cenário: Validar obrigatoriedade de campos ao incluir questão
    Dado que estou na página de gerenciamento de questões
    Quando preencho o formulário com:
      | Campo      | Valor                  |
      | Enunciado  | Qual é a cor do céu?   |
      | Opção A    | Azul                   |
    E deixo os campos "Opção B", "Opção C", "Opção D" vazios
    E clico no botão "Salvar Questão"
    Então vejo a mensagem de erro "Todas as opções são obrigatórias"
    E a questão não é salva no banco de dados

  Cenário: Alterar uma questão existente
    Dado que existe uma questão com ID 1:
      | Enunciado  | Qual é a capital da França? |
      | Opção A    | Londres                     |
      | Opção B    | Berlim                      |
      | Opção C    | Paris                       |
      | Opção D    | Madri                       |
      | Resposta   | C                           |
      | Assunto    | Geografia                   |
    Quando clico para editar a questão com ID 1
    E altero o enunciado para "Qual é a capital da Alemanha?"
    E altero a resposta correta para "B"
    E clico em "Salvar Alterações"
    Então vejo a mensagem "Questão atualizada com sucesso!"
    E o enunciado da questão muda para "Qual é a capital da Alemanha?"
    E a resposta correta é agora "B"
    E o ID da questão permanece 1

  Cenário: Alterar apenas a resposta correta de uma questão
    Dado que existe uma questão com ID 2 e resposta correta "A"
    Quando clico para editar a questão com ID 2
    E altero apenas a resposta correta para "D"
    E clico em "Salvar Alterações"
    Então a resposta correta da questão é "D"
    E os outros campos permanecem inalterados

  Cenário: Remover uma questão que não é usada
    Dado que existe uma questão com ID 3 e enunciado "Qual é 7 x 8?"
    E a questão com ID 3 não é usada em nenhuma prova
    Quando clico em "Remover" para a questão com ID 3
    E confirmo a exclusão
    Então vejo a mensagem "Questão removida com sucesso!"
    E a questão com ID 3 não existe mais no banco de dados

  Cenário: Impedir remoção de questão usada em uma prova
    Dado que existe uma questão com ID 4 e enunciado "Que animal voa?"
    E a questão com ID 4 está incluída na prova "Prova de Ciências 2024"
    Quando clico em "Remover" para a questão com ID 4
    Então vejo a mensagem de erro "Não é possível remover esta questão pois ela está sendo usada na prova: Prova de Ciências 2024"
    E a questão com ID 4 continua no banco de dados

  Cenário: Listar todas as questões com filtro por assunto
    Dado que existem 5 questões no banco de dados:
      | ID | Assunto    |
      | 1  | Geografia  |
      | 2  | Matemática |
      | 3  | Geografia  |
      | 4  | História   |
      | 5  | Matemática |
    Quando filtro as questões por assunto "Matemática"
    Então vejo 2 questões listadas
    E as questões mostradas têm IDs 2 e 5
    E a coluna "Assunto" mostra "Matemática" para todas elas

  Cenário: Pesquisar questão por enunciado parcial
    Dado que existem questões com os seguintes enunciados:
      | Qual é a capital do Brasil?          |
      | Qual é a capital da França?          |
      | Qual é o maior planeta do sistema solar? |
      | Quem descobriu o Brasil?             |
    Quando pesquiso por "capital"
    Então vejo 2 questões listadas
    E as questões mostram "capital" no enunciado
    E não vejo as questões sobre "planeta" ou "descobriu"
