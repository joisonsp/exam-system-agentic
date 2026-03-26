Feature: Criação e correção de provas
  Como usuário do sistema
  Quero poder enviar uma prova e receber feedback da correção
  Para validar o fluxo de aceitação

  Scenario: Verificar rota de saúde do servidor
    Given que o servidor está em execução
    When eu acesso a API de saúde
    Then recebo status 200
