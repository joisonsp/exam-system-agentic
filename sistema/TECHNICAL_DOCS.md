# Documentação Técnica: Sistema de Provas

## 🎯 Visão Geral do Projeto

Sistema web completo para gerenciamento, geração e correção de provas educacionais.

**Stack:**
- Frontend: React 18 + TypeScript + React Router + Vite
- Backend: Node.js + Express + TypeScript + pdfkit
- Package Manager: npm (workspaces)
- Testing: Cucumber (prepared)

---

## 📁 Estrutura de Diretórios

```
workspace/
├── client/                          # 🖥️ Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuestoesList.tsx     # CRUD de questões com modal
│   │   │   ├── QuestaoForm.tsx      # Formulário/modal de questão
│   │   │   ├── ProvasList.tsx       # CRUD de provas
│   │   │   ├── ProvaForm.tsx        # Formulário/modal de prova
│   │   │   ├── GerarProvas.tsx      # UI: gerar provas randomizadas
│   │   │   ├── questoes.css         # Estilos compartilhados
│   │   │   ├── gerar-provas.css     # Estilos GerarProvas
│   │   │   └── corrigir.css         # Estilos Corrigir
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Questoes.tsx
│   │   │   ├── Provas.tsx
│   │   │   ├── GerarProvas.tsx
│   │   │   ├── Corrigir.tsx
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── api.ts               # Wrapper Axios (10 endpoints)
│   │   ├── types.ts                 # Re-export shared types
│   │   ├── main.tsx                 # Entry point + Router
│   │   ├── global.css               # Estilos globais
│   │   └── index.html
│   ├── dist/                        # Build output (Vite)
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # 🔌 Backend (Express)
│   ├── src/
│   │   ├── services/
│   │   │   ├── storageService.ts    # CRUD (6 questões, 4 provas)
│   │   │   └── provaGeneratorService.ts  # PDF + CSV gerador
│   │   ├── routes/
│   │   │   ├── questoesRoutes.ts    # GET/POST/PUT/DELETE /questoes
│   │   │   ├── provasRoutes.ts      # GET/POST/PUT/DELETE /provas
│   │   │   └── geraProvasRoutes.ts  # Geração de provas (3 endpoints)
│   │   ├── types.ts                 # Re-export shared types
│   │   └── index.ts                 # Express app + server
│   ├── dist/                        # Build output (tsc)
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                          # 📦 Shared types
│   ├── types.ts                     # 6 interfaces (Questao, Prova, etc.)
│   └── tsconfig.json
│
├── features/                        # 🧪 Acceptance tests (Cucumber)
│   └── step_definitions/
│       └── criar_prova.steps.ts
│
├── package.json                     # Workspace root + scripts
├── tsconfig.json                    # Shared TypeScript config
├── cucumber.js                      # Cucumber configuration
├── data.json                        # Persistent storage
└── README.md                        # Project documentation
```

---

## 🔌 API Endpoints (24 total)

### Questões (5 endpoints)
```
GET    /api/questoes          # Listar todas
GET    /api/questoes/:id      # Get by ID
POST   /api/questoes          # Criar nova
PUT    /api/questoes/:id      # Atualizar
DELETE /api/questoes/:id      # Deletar
```

### Provas (5 endpoints)
```
GET    /api/provas            # Listar todas
GET    /api/provas/:id        # Get by ID
POST   /api/provas            # Criar nova
PUT    /api/provas/:id        # Atualizar
DELETE /api/provas/:id        # Deletar
```

### Geração (3 endpoints)
```
POST   /api/gerar-provas                      # Gerar provas PDF + CSV
GET    /api/baixar-provas/:generationId/:num  # Download PDF individual
GET    /api/baixar-gabarito/:generationId     # Download CSV gabarito
```

### Servidor (2 endpoints)
```
GET    /health                 # Health check
POST   /upload-csv            # CSV upload (preparado)
```

---

## 🎨 UI Routes (5 páginas)

```typescript
BrowserRouter
├── /                   → Home.tsx              # Landing page
├── /questoes          → Questoes.tsx           # Question management
├── /provas            → Provas.tsx             # Proof management
├── /gerar-provas      → GerarProvas.tsx        # PDF generation
└── /corrigir          → Corrigir.tsx           # Correction (partial)
```

---

## 💾 Tipagem de Dados

### Alternativa
```typescript
{
  id: string (uuid);
  descricao: string;
  correta: boolean;
}
```

### Questão
```typescript
{
  id: string (uuid);
  enunciado: string;
  alternativas: Alternativa[];
}
```

### Prova
```typescript
{
  id: string (uuid);
  nome: string;
  questoesIds: string[];
  identificacaoAlternativas: "letras" | "potencias";
}
```

### Gabarito Gerado
```typescript
{
  numeroProva: number;
  respostas: string[];  // ["A", "B", "C", ...]
}
```

---

## 🛠️ Fluxos Principais

### 1️⃣ Criar Questão
```
Frontend: Questoes.tsx → QuestaoForm (modal)
         Input: enunciado + alternativas
         POST /api/questoes
Backend: questoesRoutes → storageService.criarQuestao()
         Validation: enunciado obrigatório, 2+ alternativas, 1 correta
         Storage: salva em data.json
Result: ✓ Questão criada com UUID
```

### 2️⃣ Criar Prova
```
Frontend: Provas.tsx → ProvaForm (modal)
         Input: nome + questoesIds[] + identificacaoAlternativas
         POST /api/provas
Backend: provasRoutes → storageService.criarProva()
         Validation: nome obrigatório, 1+ questões, tipo válido, questões existem
         Storage: salva em data.json
Result: ✓ Prova criada com UUID
```

### 3️⃣ Gerar Provas em PDF
```
Frontend: GerarProvas.tsx
         Input: provaId + quantidade (1-1000)
         POST /api/gerar-provas
Backend: geraProvasRoutes
         1. Busca prova + questões
         2. Chama provaGeneratorService.generateProvasAndGabarito()
            - Embaralha questões
            - Embaralha alternativas em cada questão
            - Gera N versões diferentes
         3. Cria PDFs com pdfkit
         4. Cria CSV gabarito
         5. Armazena em Map (30-min auto-cleanup)
         6. Retorna JSON: {generationId, quantidade, gabarito_csv}
Frontend: Baixa PDFs individuais ou lote com fetch
         GET /api/baixar-provas/:generationId/:provaNumber
         GET /api/baixar-gabarito/:generationId
Result: ✓ Arquivos prontos para download
```

### 4️⃣ Corrigir Provas (TODO)
```
Frontend: Corrigir.tsx
         Input: CSV com respostas dos alunos
         TO IMPLEMENT: POST para validar/corrigir
Backend: Endpoint necessário
         TODO: Implementar lógica de correção
Result: ✓ Scores + feedback para cada aluno
```

---

## 📊 Status dos Componentes

| Item | Status | Localização |
|------|--------|-------------|
| CRUD Questões | ✅ Completo | questoesRoutes.ts + QuestoesList.tsx |
| CRUD Provas | ✅ Completo | provasRoutes.ts + ProvasList.tsx |
| Geração PDF | ✅ Completo | provaGeneratorService.ts |
| Gabarito CSV | ✅ Completo | provaGeneratorService.ts |
| Download PDF | ✅ Completo | geraProvasRoutes.ts |
| Download Gabarito | ✅ Completo | geraProvasRoutes.ts |
| UI GerarProvas | ✅ Completo | GerarProvas.tsx |
| UI Corrigir | 🟡 Parcial | Corrigir.tsx (form criado, lógica TODO) |
| Styling Global | ✅ Completo | global.css |
| Styling Componentes | ✅ Completo | questoes.css, gerar-provas.css, corrigir.css |
| Documentação | ✅ Completo | README.md |
| Testes Acceptance | 🟡 Parcial | cucumber.js + 1 feature criada |

---

## 🚀 Como Rodar

### Desenvolvimento
```bash
# Terminal 1 - Backend
npm run dev:server
# Server em http://localhost:4000

# Terminal 2 - Frontend
npm run dev:client
# Client em http://localhost:5173
```

### Build Produção
```bash
npm run build
# Gera: server/dist/ e client/dist/
```

### Verificação TypeScript
```bash
npm run type-check
```

### Testes
```bash
npm run cucumber
```

---

## 📦 Dependências Principais

**Client:**
- react 18.3.1
- react-router-dom 6.16.0
- axios 1.5.0
- typescript 5.1.6
- vite 5.3.0

**Server:**
- express 4.18.4
- pdfkit 0.13.0
- uuid 9.0.0
- cors (built-in)
- multer 1.4.5

**Shared:**
- typescript 5.1.6

**Dev:**
- ts-node-dev 2.0.0
- @cucumber/cucumber 9.0.0
- chai 4.3.0

---

## 📋 Validações Implementadas

### Questão
- ✓ Enunciado não vazio
- ✓ Mínimo 2 alternativas
- ✓ Exatamente 1 alternativa correta
- ✓ IDs das alternativas únicos

### Prova
- ✓ Nome não vazio
- ✓ Mínimo 1 questão
- ✓ identificacaoAlternativas em ['letras', 'potencias']
- ✓ Todas as questoesIds existem no sistema

### Geração
- ✓ Quantidade entre 1-1000
- ✓ Prova existe
- ✓ Prova tem questões

---

## 🎯 TODOs Futuros

- [ ] Implementar endpoint de correção (POST /api/corrigir)
- [ ] Parsing CSV de respostas (Corrigir.tsx)
- [ ] Cálculo de scores e feedback
- [ ] Relatórios de desempenho
- [ ] Autenticação de usuários
- [ ] Integração com banco de dados (PostgreSQL)
- [ ] Toast notifications (react-toastify)
- [ ] Validação e sanitização de inputs
- [ ] Unit tests para services
- [ ] CI/CD pipeline (GitHub Actions)

---

## 🔐 Notas de Segurança

- ⚠️ Sem autenticação (TODO)
- ⚠️ Sem validação de entrada rigorosa (TODO)
- ⚠️ CORS habilitado para todos (considerar restringir)
- ✓ IDs gerados com uuid v4
- ✓ PDF gerado em memória (não salva filesystem)

---

## 📈 Performance

- **Bundle Size**: 216.5 kB (71.9 kB gzip)
- **Modules**: 96 (Vite)
- **PDF Generation**: ~100ms por prova
- **Data Store**: Em memória com JSON file fallback
- **Generation Storage**: Map com 30-min auto-cleanup

---

## 💡 Arquitetura Decisions

1. **Monorepo com npm workspaces**: Compartilhamento de tipos entre frontend/backend
2. **In-memory storage**: Simplicidade, sem setup de DB (pode evoluir para PostgreSQL)
3. **pdfkit para PDFs**: Lib leve e confiável para geração programática
4. **React hooks + Context não usado**: Props drilling suficiente para escopo atual
5. **CSS sem preprocessor**: Simples com CSS variables para temas
6. **Cucumber preparado**: Framework de testes, 1 feature básica criada

---

## 📞 Support / Issues

Veja **README.md** para:
- Instruções de instalação
- Endpoints detalhados
- Formato de dados esperado
- Troubleshooting
- Configuração de ambiente

