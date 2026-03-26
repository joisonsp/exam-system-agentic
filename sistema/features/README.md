# Testes de Aceitação - Cucumber

Este diretório contém os testes de aceitação para o sistema de gerenciamento de provas, usando BDD com Cucumber/Gherkin.

## 📋 Estrutura

```
features/
├── gerenciamento_questoes.feature    # Testes de CRUD de questões
├── gerenciamento_provas.feature      # Testes de CRUD de provas
├── geracao_provas.feature            # Testes de geração de PDFs
├── correcao_provas.feature           # Testes de correção automática
├── support/
│   ├── world.ts                      # Contexto compartilhado entre steps
│   ├── hooks.ts                      # Setup/teardown dos testes
│   └── utils.ts                      # Funções utilitárias
└── step_definitions/
    ├── gerenciamento_questoes.ts     # Steps para questões
    ├── gerenciamento_provas.ts       # Steps para provas
    ├── geracao_provas.ts             # Steps para geração
    └── correcao_provas.ts            # Steps para correção
```

## 🚀 Executando os Testes

### Opção 1: Executar todos os testes (com servidor automático)

```bash
npm run test:acceptance
```

Este comando:
1. Compila o servidor
2. Inicia o servidor em background
3. Executa os testes Cucumber
4. Encerra o servidor automaticamente

### Opção 2: Executar apenas testes Cucumber (servidor já rodando)

```bash
# Em um terminal, inicie o servidor
npm run dev:server

# Em outro terminal, execute os testes
npm run test:cucumber
```

### Opção 3: Executar apenas features específicas

```bash
npx cucumber-js features/gerenciamento_questoes.feature
npx cucumber-js features/gerenciamento_provas.feature
npx cucumber-js features/geracao_provas.feature
npx cucumber-js features/correcao_provas.feature
```

### Opção 4: Executar apenas um cenário específico

```bash
npx cucumber-js features/gerenciamento_questoes.feature --name "Incluir uma nova questão com sucesso"
```

## 📊 Relatórios

Os testes geram automaticamente:

- **cucumber-report.html** - Relatório visual em HTML
- **cucumber-report.json** - Relatório em JSON para integração CI/CD

Abra o relatório HTML no navegador:
```bash
open cucumber-report.html  # macOS
xdg-open cucumber-report.html  # Linux
start cucumber-report.html  # Windows
```

## 📝 Estrutura de um Step Definition

Todos os steps seguem o padrão Given-When-Then:

```typescript
Given('que existe uma questão com ID {int}', async function (id: number) {
  // Setup dados de teste
});

When('clico no botão {string}', async function (botao: string) {
  // Executar ação
});

Then('vejo a mensagem {string}', function (mensagem: string) {
  // Validar resultado com Chai expect()
});
```

## 🔍 Validações Implementadas

### Questões
- ✅ Criar questões com validação de campos obrigatórios
- ✅ Alterar enunciado e resposta correta
- ✅ Remover questões (com proteção contra remoção em uso)
- ✅ Filtrar por assunto e pesquisar

### Provas
- ✅ Criar provas selecionando questões
- ✅ Alterar ordem das questões
- ✅ Adicionar/remover questões
- ✅ Duplicar provas
- ✅ Filtrar por status

### Geração de PDFs
- ✅ Gerar múltiplas cópias de provas
- ✅ Embaralhamento de questões e opções
- ✅ Geração com nomes de alunos
- ✅ Gabarito separado
- ✅ Download em ZIP
- ✅ CSV com metadados

### Correção de Provas
- ✅ Modo Rigoroso: 1 ponto se correto, 0 se qualquer erro
- ✅ Modo Proporcional: pontuação proporcional
- ✅ Múltipla seleção
- ✅ Validação de formato CSV
- ✅ Relatórios com estatísticas:
  - Média, mediana, desvio padrão
  - Taxa de aprovação
  - Desempenho por questão
  - Comparação entre turmas

## 🛠️ Utilitários de Teste

O arquivo `support/utils.ts` fornece funções auxiliares:

### Cálculo de Pontuação

```typescript
// Modo Rigoroso
const rigorous = calcularPontuacaoRigorosa(['A', 'B', 'C'], ['A', 'B', 'C']);
// { acertos: 3, erros: 0, percentual: 100 }

// Modo Proporcional
const proportional = calcularPontuacaoProporcional(['A', 'B', 'C'], ['A', 'B', 'D']);
// { acertos: 2, pontos: 6.67, percentual: 66.67 }
```

### Status e Estatísticas

```typescript
const status = determinarStatus(75);
// 'Bom'

const stats = calcularEstatisticas([
  { percentual: 100 }, { percentual: 80 }, { percentual: 60 }
]);
// { total: 3, media: 80, mediana: 80, ... }
```

## 🔄 Contexto Compartilhado (World)

A classe `ProvasWorld` no arquivo `support/world.ts` mantém o estado:

```typescript
world.questoes        // Map<id, questão>
world.provas          // Map<id, prova>
world.gabarito        // Map<numeroProva, respostas[]>
world.respostasAlunos // Array de respostas
world.resultadosCorrecao // Array de resultados

// Usar no step
When('clico no botão Salvar', async function() {
  world.questaoId = 1;  // Armazenar para uso posterior
});

// Acessar em outro step
Then('a questão é armazenada', function() {
  expect(world.questaoId).to.equal(1);
});
```

## 🧪 Hooks de Teste

Os hooks em `support/hooks.ts` garantem:

- ✅ Servidor está pronto antes de cada cenário
- ✅ Limpeza de dados após cada cenário
- ✅ Logging de falhas para debugging
- ✅ Timeout adequado (30 segundos)

## 📝 Exemplos de Features

### Gerenciamento de Questões

```gherkin
Cenário: Incluir uma nova questão com sucesso
  Dado que estou na página de gerenciamento de questões
  Quando preencho o formulário com:
    | Campo      | Valor                 |
    | Enunciado  | Qual é 2 + 2?        |
    | Opção A    | 3                    |
    | Opção B    | 4                    |
  E clico no botão "Salvar Questão"
  Então vejo a mensagem "Questão criada com sucesso!"
  E a questão é armazenada no banco de dados com ID 1
```

### Correção de Provas

```gherkin
Cenário: Corrigir prova em modo Rigoroso
  Dado que existe um arquivo "gabarito.csv"
  E existe um arquivo "respostas.csv"
  Quando seleciono "gabarito.csv"
  E seleciono "respostas.csv"
  E mantenho o modo padrão "Rigoroso"
  E clico em "Corrigir Provas"
  Então a correção é executada
  E os resultados mostram:
    | nomeAluno    | acertos | total | percentual |
    | João Silva   | 4       | 4     | 100%       |
```

## 💡 Dicas

### Debug de Testes

Para ver mais detalhes durante a execução:

```bash
npx cucumber-js --format progress --publish-quiet
```

### Executar em Modo Seco (Dry-Run)

Para verificar se todos os steps estão implementados:

```bash
npx cucumber-js --dry-run
```

### Filtrar por Tags

Se os cenários tiverem tags, é possível filtrar:

```bash
npx cucumber-js --tags "@smoke"
```

## 🔗 Integração CI/CD

Para usar em pipelines CI/CD, configure:

```bash
npm run test:acceptance -- --format json > cucumber-report.json
```

## ⚠️ Troubleshooting

### Servidor não inicia

- Verifique se a porta 4000 está disponível
- Verifique se o servidor não está sendo executado em outro terminal
- Verifique logs de erro: `npm run dev:server`

### Testes falham com erro de conexão

- Aguarde mais tempo para o servidor iniciar (aumentar `MAX_RETRIES` em `run-tests.ts`)
- Verifique a URL da API em `features/support/world.ts`

### Problemas com TypeScript

- Execute: `npm run build`
- Limpe node_modules: `rm -rf node_modules && npm install`

## 📚 Referências

- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Chai Assertion Library](https://www.chaijs.com/)
