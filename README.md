# Sistema de Criação e Correção de Provas

Um aplicativo web full-stack para criar, gerenciar, gerar e corrigir provas/testes educacionais. Construído com React no frontend e Node.js/Express no backend, ambos em TypeScript.

## Características

- ✅ **Gestão de Questões**: Criar, editar e deletar questões com múltiplas alternativas
- ✅ **Gestão de Provas**: Criar e gerenciar provas selecionando questões
- ✅ **Geração de PDFs**: Gerar provas randomizadas em PDF com shuffling de questões e alternativas
- ✅ **Gabarito**: Gerar arquivo CSV com as respostas corretas
- ✅ **Download**: Baixar PDFs individuais ou em lote, e gabarito
- 🟡 **Correção**: Interface para upload de respostas dos alunos (em desenvolvimento)
- ⏳ **Autenticação**: Planejado para versões futuras

## Estrutura do Projeto

```
workspace/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes React reutilizáveis
│   │   │   ├── QuestoesList.tsx     # Lista de questões com CRUD
│   │   │   ├── QuestaoForm.tsx      # Formulário modal para criar/editar questão
│   │   │   ├── ProvasList.tsx       # Lista de provas com CRUD
│   │   │   ├── ProvaForm.tsx        # Formulário modal para criar/editar prova
│   │   │   ├── GerarProvas.tsx      # UI para gerar e baixar provas
│   │   │   ├── questoes.css         # Estilos compartilhados
│   │   │   ├── gerar-provas.css     # Estilos para GerarProvas
│   │   │   └── corrigir.css         # Estilos para Corrigir
│   │   ├── pages/                   # Páginas/rotas
│   │   │   ├── Home.tsx             # Página inicial
│   │   │   ├── Questoes.tsx         # Página de gestão de questões
│   │   │   ├── Provas.tsx           # Página de gestão de provas
│   │   │   ├── GerarProvas.tsx      # Página para gerar provas
│   │   │   ├── Corrigir.tsx         # Página para corrigir provas
│   │   │   └── index.ts             # Exports de páginas
│   │   ├── services/                
│   │   │   └── api.ts               # Cliente Axios com métodos para API
│   │   ├── types.ts                 # Re-export de tipos compartilhados
│   │   ├── main.tsx                 # Entry point React + Router
│   │   ├── global.css               # Estilos globais
│   │   └── index.html               # Template HTML
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── services/
│   │   │   ├── storageService.ts    # CRUD em memória com persistência JSON
│   │   │   └── provaGeneratorService.ts  # Geração de PDFs e gabaritos
│   │   ├── routes/
│   │   │   ├── questoesRoutes.ts    # Endpoints: GET, POST, PUT, DELETE questões
│   │   │   ├── provasRoutes.ts      # Endpoints: GET, POST, PUT, DELETE provas
│   │   │   └── geraProvasRoutes.ts  # Endpoints: gerar provas, baixar PDFs/gabarito
│   │   ├── types.ts                 # Re-export de tipos compartilhados
│   │   └── index.ts                 # Express app setup
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                          # Tipos compartilhados
│   ├── types.ts                     # Interfaces: Questao, Prova, etc.
│   └── tsconfig.json
│
├── package.json                     # Workspace root
├── tsconfig.json                    # Configuração TypeScript compartilhada
├── data.json                        # Armazenamento persistente de dados
└── README.md                        # Este arquivo
```

## Tecnologias

### Frontend
- **React** 18.3.1
- **React Router** 6.16.0
- **TypeScript** 5.1.6
- **Vite** 5.3.0 (build tool)
- **Axios** 1.5.0 (HTTP client)
- **CSS Modules** (estilos)

### Backend
- **Node.js** + **Express** 4.18.4
- **TypeScript** 5.1.6
- **pdfkit** 0.13.0 (geração de PDFs)
- **uuid** 9.0.0 (geração de IDs)

### Testes (Preparado)
- **Cucumber** 9.0.0
- **Chai** 4.3.0

## Instalação

### Pré-requisitos
- Node.js 16+ e npm 8+

### Passos

1. Clone ou navegue até o diretório do projeto:
```bash
cd workspace
```

2. Instale as dependências:
```bash
npm install
```

Isto instalará dependências no root, client/ e server/ conforme configurado em workspaces.

## Como Usar

### Desenvolvimento

#### Terminal 1 - Iniciar Backend
```bash
npm run dev:server
```
O servidor estará disponível em `http://localhost:4000`

#### Terminal 2 - Iniciar Frontend (em outro terminal)
```bash
npm run dev:client
```
A aplicação estará disponível em `http://localhost:5173`

### Produção

#### Build
```bash
npm run build
```
Gera `server/dist/` e `client/dist/` com código otimizado.

#### Verificar com TypeScript
```bash
npm run type-check
```

## API Endpoints

### Questões
- `GET /api/questoes` - Listar todas as questões
- `GET /api/questoes/:id` - Obter uma questão
- `POST /api/questoes` - Criar questão
- `PUT /api/questoes/:id` - Atualizar questão
- `DELETE /api/questoes/:id` - Deletar questão

**Formato da Questão:**
```json
{
  "enunciado": "Qual é a capital do Brasil?",
  "alternativas": [
    { "id": "uuid", "descricao": "Brasília", "correta": true },
    { "id": "uuid", "descricao": "Rio de Janeiro", "correta": false }
  ]
}
```

### Provas
- `GET /api/provas` - Listar todas as provas
- `GET /api/provas/:id` - Obter uma prova
- `POST /api/provas` - Criar prova
- `PUT /api/provas/:id` - Atualizar prova
- `DELETE /api/provas/:id` - Deletar prova

**Formato da Prova:**
```json
{
  "nome": "Prova de Geografia",
  "questoesIds": ["uuid1", "uuid2", "uuid3"],
  "identificacaoAlternativas": "letras"
}
```

### Geração de Provas
- `POST /api/gerar-provas` - Gerar provas randomizadas
- `GET /api/baixar-provas/:generationId/:provaNumber` - Baixar PDF de uma prova
- `GET /api/baixar-gabarito/:generationId` - Baixar CSV gabarito

**Exemplo de requisição POST /api/gerar-provas:**
```json
{
  "provaId": "uuid-da-prova",
  "quantidade": 5
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "5 prova(s) gerada(s) com sucesso",
  "generationId": "unique-id",
  "quantidade": 5,
  "gabarito": "numeroProva,respostas\n1,\"A,B,C,D\"\n..."
}
```

## Fluxo de Uso

1. **Criar Questões**: Navegue para "Questões" e crie suas questões selecionando o tipo de alternativas
2. **Criar Provas**: Vá para "Provas" e crie uma nova prova selecionando as questões desejadas
3. **Gerar PDFs**: Acesse "Gerar Provas", selecione a prova e quantidade desejada
4. **Baixar Arquivos**: Baixe os PDFs e o gabarito CSV para distribuição

## Formato do Armazenamento

Dados são salvos em `data.json` com estrutura:
```json
{
  "questoes": [...],
  "provas": [...]
}
```

## Validações

### Questão
- Enunciado obrigatório
- Mínimo 2 alternativas
- Exatamente uma alternativa marcada como correta

### Prova
- Nome obrigatório
- Mínimo 1 questão
- Tipo de identificação obrigatório: "letras" (A, B, C...) ou "potencias" (2, 4, 8...)
- Todas as questões referenciadas devem existir

### Geração
- Quantidade entre 1 e 1000
- Prova deve existir e ter questões

## Recursos em Desenvolvimento

- [ ] CSV upload para correção de provas
- [ ] Sistema de autenticação de usuários
- [ ] Cálculo automático de notas
- [ ] Relatórios de desempenho
- [ ] Testes de aceitação (Cucumber) integrados
- [ ] Casos de teste unitários

## Testes

### Executar testes unitários
```bash
npm run test
```

### Testes de Aceitação (Cucumber)
```bash
npm run test:acceptance
```

### Verificar cobertura de cenários
```bash
npx cucumber-js --require-module ts-node/register --require features/**/*.ts --format progress
```

## Formato de CSV de correção

### Gabarito
- Cabeçalho: `numeroProva,respostas`
- Cada linha: número da prova e respostas separadas por vírgula

Exemplo:
```csv
numeroProva,respostas
1,A,B,C,D
2,B,A,C,D
```

### Respostas de alunos
- Cabeçalho: `nomeAluno,numeroProva,respostas`
- Cada linha: nome do aluno, número da prova e respostas separadas por vírgula

Exemplo:
```csv
nomeAluno,numeroProva,respostas
João,1,A,B,C,D
Maria,1,A,B,D,D
```

### Validação esperada
- O backend valida campos obrigatórios e formatos
- As respostas são comparadas por posição com o gabarito
- Pontuação rigorosa: 1 ponto por prova se todas as respostas corretas
- Pontuação proporcional: 10 pontos distribuídos pelos acertos

## Configuração

### Variáveis de Ambiente

**Client** (`.env.local`):
```
REACT_APP_API_URL=http://localhost:4000/api
```

**Server**:
Padrão porta 4000. Pode ser alterado em `server/src/index.ts`

## Troubleshooting

### Porta já em uso
Se a porta 4000 estiver em uso:
```bash
# Altere em server/src/index.ts a constant PORT
# Ou mude a porta do cliente em client/vite.config.ts
```

### Erro ao gerar PDFs
- Verifique se pdfkit está instalado: `npm list pdfkit`
- Verifique se a prova tem questões válidas

### CORS errors
- O servidor tem CORS habilitado por padrão
- Se localhost:5173 retornar erro, adicione a URL em `server/src/index.ts`

## Estrutura de Dados

### Questão
```typescript
interface Alternativa {
  id: string;
  descricao: string;
  correta: boolean;
}

interface Questao {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
}
```

### Prova
```typescript
interface Prova {
  id: string;
  nome: string;
  questoesIds: string[];
  identificacaoAlternativas: 'letras' | 'potencias';
}
```

### Gabarito
```typescript
interface GabaritoProva {
  numeroProva: number;
  respostas: string[];
}
```

## Performance

- PDFs gerados em memória: ~50KB por PDF para 10 questões
- Gabarito CSV: ~1-2KB por 100 provas
- Cleanup automático de gerações: 30 minutos de inatividade

## Contribuindo

Para melhorias futuras:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit e push
4. Abra um Pull Request

## Licença

Este projeto é fornecido como está para fins educacionais.

## Suporte

Para reportar bugs ou solicitar features, abra uma issue no repositório.
