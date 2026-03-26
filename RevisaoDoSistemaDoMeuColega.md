1. Revisão do Sistema de Eduardo Carlos Barboza Neto

1.1. O sistema está funcionando com as funcionalidades solicitadas? 
O sistema apresenta funcionalidades básicas, mas falha em alguns dos requisitos solicitados na especificação e extras propostos por Eduardo:

Acesso e API: Não foi possível autenticar diretamente via requisições na API com os parâmetros fornecidos, nem utilizar o Swagger. O acesso só foi possível através do frontend (deploy no Vercel), onde o token de autenticação foi obtido.

Provas: A geração de PDF funciona, mas o cabeçalho gerado está incompleto, faltando informações obrigatórias como o nome do professor.
O CSV do gabarito é gerado inicialmente sem respostas (apenas com a versão da prova); ele só passa a funcionar corretamente após uma definição manual posterior.

Não há um fluxo claro ou exemplos de como as respostas dos alunos devem ser enviadas para o sistema realizar a correção.

A funcionalidade de remoção de provas não está funcionando, descumprindo o requisito de gerenciamento completo (inclusão, alteração e remoção).

Questões: Há um problema de usabilidade/navegação. Após criar uma questão, não é possível visualizá-la de forma independente; as questões só ficam visíveis quando se acessa a aba de provas.

1.2. Quais os problemas de qualidade do código e dos testes? 

Testes de Aceitação: O colega implementou testes usando a linguagem Gherkin do Cucumber, o que era uma exigência estrita do experimento. Os testes são realizados apenas para frontend.

Validação de Dados: O sistema carece de validações no frontend e backend. É possível inserir letras no campo de CPF durante o cadastro de alunos(extra dele).

Tratamento de Datas: O sistema permite a criação de provas com datas no passado (ex: 22/08/1998) e apresenta um bug de timezone, salvando a data com um dia a menos do que o selecionado.

2 Revisão do Histórico do Desenvolvimento
2.1. Estratégias de interação utilizadas:
O colega adotou uma abordagem estruturada e baseada em papéis (personas). Ele iniciou o projeto pedindo para o agente assumir múltiplos papéis específicos: reviewer, tester, db-validator e architect. Além disso, ele utilizou arquivos de contexto (como CLAUDE.MD e /docs/requirements.md) e forneceu o esquema do banco de dados já modelado para guiar a criação do backend. A estratégia foi dividir o desenvolvimento em grandes blocos lógicos: modelagem de banco de dados e infraestrutura (Prisma/Docker) $\rightarrow$ Backend (Hexagonal) $\rightarrow$ Refatoração $\rightarrow$ Frontend $\rightarrow$ Testes.

2.2. Situações em que o agente funcionou melhor ou pior:

Melhor: O agente teve um desempenho bom na criação de infraestrutura (Docker), modelagem do Prisma, geração de documentação automática (Swagger) e em refatorações arquiteturais. O uso do agente como revisor também funcionou bem, pois o colega relatou que a IA conseguiu identificar e corrigir seus próprios bugs durante a implementação do backend sem precisar de novos prompts.

Pior: O ponto fraco relatado foi a implementação dos testes de aceitação com Gherkin. O colega relatou que foi "cansativo ter que esperar", que a IA demorou muito, quebrou testes existentes no backend e precisou de várias intervenções manuais para se corrigir. O agente também falhou inicialmente em respeitar a estrutura de pastas solicitada para o frontend.

2.3. Tipos de problemas observados (por exemplo, código incorreto ou inconsistências):
Os problemas mais frequentes envolveram a perda de contexto em arquivos e arquitetura, o agente ignorou o sistema de arquivos exigido para o Next.js, gerou documentação no diretório errado (raiz em vez de /backend) e teve pequenos esquecimentos ao tentar replicar layouts. Além disso, houveram problemas de inconsistência nos testes, onde a tentativa de criar testes de aceitação acabou quebrando os testes unitários/e2e do backend, exigindo múltiplas intervenções do desenvolvedor para estabilizar o código. Conforme visto na revisão do sistema, o agente também falhou em sugerir boas práticas de validação de dados (permitindo letras no CPF e errando timezones).

2.4. Avaliação geral da utilidade do agente no desenvolvimento:
Apesar dos gargalos com os testes, a avaliação geral do colega indica que a ferramenta foi extremamente útil para alavancar a produtividade inicial e estruturar o projeto. A capacidade de delegar tarefas repetitivas (como documentação de rotas e criação de middlewares de segurança) e a técnica de colocar o agente para revisar o próprio código compensaram as falhas. No entanto, ficou claro que a ferramenta exige supervisão humana, especialmente na camada de testes.

2.5. Comparação com a sua experiência de uso do agente:
A experiência do colega contrasta e se assemelha com a minha em pontos curiosos:

Abordagem de Prompts: Enquanto o colega investiu tempo criando agentes especializados (reviewer, architect), eu adotei uma abordagem de prompts focados em rotas e componentes específicos, utilizando o GitHub Copilot (Raptor mini, Claude Haiku 4.5 e Grok Code Fast 1).

Proatividade excessiva: Eu sofri com o que chamei de "excesso de proatividade" do agente (gerando mais de 12 arquivos Markdown não solicitados), enquanto o colega teve problemas com o agente ignorando arquivos de configuração que ele havia solicitado.

Complexidade técnica: Eu tive bastante dificuldade técnica com a integração de bibliotecas específicas (geração de PDFs corrompidos via pdfkit e problemas de parsing no CSV de correção gerando erro 500). O colega não relatou tantos problemas com a lógica de negócio, focando mais na frustração com a lentidão e quebra dos testes.

Nós dois esbarramos em um limite claro dos LLMs atuais, a dificuldade em lidar com Testes de Aceitação em Gherkin. Em ambos os projetos, pedir testes BDD completos resultou em lentidão, código quebrado, perda de contexto e exigiu forte intervenção manual.
