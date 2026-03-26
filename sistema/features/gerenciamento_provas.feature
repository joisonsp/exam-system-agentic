# language: pt
Funcionalidade: Gerenciamento de Provas
  Descrição: Gerenciar provas selecionando questões
  Como um professor
  Quero criar, alterar e remover provas
  Para organizar as avaliações dos meus alunos

  Cenário: Criar uma nova prova selecionando questões
    Dado que existem as seguintes questões disponíveis:
      | ID | Enunciado                      | Resposta |
      | 1  | Qual é a capital do Brasil?    | B        |
      | 2  | Qual é 2 + 2?                  | B        |
      | 3  | Qual é a capital da França?    | C        |
      | 4  | Qual é 10 / 2?                 | A        |
    Quando estou na página de criação de provas
    E preencho o formulário com:
      | Campo      | Valor                  |
      | Nome       | Prova de Conhecimentos |
      | Descrição  | Avaliação geral        |
      | Disciplina | Múltiplos              |
    E seleciono as questões com IDs: 1, 2, 3
    E clico em "Criar Prova"
    Então vejo a mensagem "Prova criada com sucesso!"
    E a prova é armazenada com ID 1
    E a prova contém 3 questões
    E as questões da prova são as com IDs 1, 2, 3 na mesma ordem

  Cenário: Criar prova com questões de assunto específico
    Dado que existem questões com os seguintes assuntos:
      | ID | Assunto    | Enunciado           |
      | 1  | Matemática | 5 + 3 =?            |
      | 2  | Matemática | 10 - 4 =?           |
      | 3  | Matemática | 2 x 7 =?            |
      | 4  | Geografia  | Capital do Brasil?  |
      | 5  | Geografia  | Capital da França?  |
    Quando estou na página de criação de provas
    E preencho:
      | Campo     | Valor          |
      | Nome      | Prova de Matemática |
      | Assunto   | Matemática     |
    E filtro questões por assunto "Matemática"
    E seleciono todas as 3 questões de Matemática
    E clico em "Criar Prova"
    Então a prova contém 3 questões
    E todas as questões são de assunto "Matemática"

  Cenário: Validar número mínimo de questões
    Dado que estou na página de criação de provas
    Quando preencho:
      | Campo | Valor           |
      | Nome  | Prova incompleta |
    E seleciono apenas 0 questões
    E clico em "Criar Prova"
    Então vejo mensagem de erro "Mínimo de 1 questão é obrigatório"
    E a prova não é criada

  Cenário: Alterar ordem das questões de uma prova
    Dado que existe a prova com ID 1 contendo as seguintes questões:
      | Posição | ID |
      | 1       | 1  |
      | 2       | 2  |
      | 3       | 3  |
    Quando clico para editar a prova com ID 1
    E mudo a questão da posição 1 para a posição 3
    E mudo a questão da posição 3 para a posição 1
    E clico em "Salvar Alterações"
    Então as questões da prova estão na nova ordem:
      | Posição | ID |
      | 1       | 3  |
      | 2       | 2  |
      | 3       | 1  |

  Cenário: Adicionar novas questões a uma prova existente
    Dado que existe a prova com ID 1 contendo 2 questões
    E existem questões disponíveis com IDs 5, 6, 7
    Quando clico para editar a prova com ID 1
    E agradeço as questões com IDs 5 e 7 à prova
    E clico em "Salvar Alterações"
    Então a prova passará a conter 4 questões
    E as novas questões são 5 e 7

  Cenário: Remover questão de uma prova mantendo a prova ativa
    Dado que existe a prova com ID 1 contendo 4 questões
    Quando clico para editar a prova com ID 1
    E removo a questão na posição 2
    E clico em "Salvar Alterações"
    Então a prova passa a conter 3 questões
    E as posições das questões restantes são reordenadas

  Cenário: Listar todas as provas com seus status
    Dado que existem as seguintes provas:
      | ID | Nome               | Questões | Status    |
      | 1  | Prova de Ciências  | 5        | Ativa     |
      | 2  | Prova de Português | 8        | Ativa     |
      | 3  | Prova Antigo 2023  | 10       | Arquivada |
      | 4  | Prova de Teste     | 3        | Rascunho  |
    Quando estou na página de listagem de provas
    Então vejo 4 provas listadas com seus dados
    E posso ordenar por nome, quantidade de questões ou status
    E posso filtrar por status "Ativa"

  Cenário: Filtrar provas por status
    Dado que existem 4 provas no total
    Quando filtro por status "Ativa"
    Então vejo apenas 2 provas listadas
    E ambas têm status "Ativa"

  Cenário: Duplicar uma prova
    Dado que existe a prova com ID 1 chamada "Prova Original"
    E a prova contém 5 questões
    Quando clico em "Duplicar" para a prova com ID 1
    E preencho o novo nome como "Prova Original - Cópia"
    Então uma nova prova é criada com ID 2
    E a prova com ID 2 contém as mesmas 5 questões
    E a prova original com ID 1 não é alterada

  Cenário: Remover uma prova que não foi utilizada
    Dado que existe a prova com ID 1 chamada "Prova de Teste"
    E a prova nunca foi aplicada a nenhuma turma
    Quando clico em "Remover" para a prova com ID 1
    E confirmo a exclusão
    Então vejo mensagem "Prova removida com sucesso!"
    E a prova não existe mais no banco de dados

  Cenário: Impedir remoção de prova já aplicada
    Dado que existe a prova com ID 2 chamada "Prova de Avaliação 2024"
    E a prova foi aplicada para a turma "1º Ano A" em 20/03/2024
    Quando clico em "Remover" para a prova com ID 2
    Então vejo mensagem de erro "Não é possível remover esta prova pois já foi aplicada à turma: 1º Ano A"
    E a prova continua existindo no banco de dados

  Cenário: Alterar nome e descrição de uma prova
    Dado que existe a prova com ID 1:
      | Campo       | Valor            |
      | Nome        | Prova Antiga      |
      | Descrição   | Descrição antiga  |
    Quando clico para editar a prova com ID 1
    E altero o nome para "Prova Atualizada"
    E altero a descrição para "Nova descrição"
    E clico em "Salvar Alterações"
    Então o nome da prova muda para "Prova Atualizada"
    E a descrição muda para "Nova descrição"
    E as questões da prova não são alteradas
