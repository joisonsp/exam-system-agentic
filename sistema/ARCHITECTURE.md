# Diagrama de Arquitetura - Sistema de Provas

## 🏗️ Estrutura de Componentes & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (React/Vite)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Home.tsx    │  │Questões.tsx  │  │ Provas.tsx   │  │GerarProvas  │ │
│  │  (landing)   │  │              │  │              │  │  .tsx       │ │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘  └─────────────┘ │
│                          │                   │                 │        │
│  ┌──────────────┐        │                   │                 │        │
│  │ Corrigir.tsx │        │                   │                 │        │
│  │  (partial)   │        │                   │                 │        │
│  └──────────────┘        │                   │                 │        │
│                          ▼                   ▼                 ▼        │
│                   ┌───────────────────────────────────────────────┐    │
│                   │  QuestoesList + ProvasList + GerarProvas      │    │
│                   │  (Modal Forms: QuestaoForm, ProvaForm)        │    │
│                   └──────────────┬──────────────────────────────┘    │
│                                  │                                    │
│                   ┌──────────────▼──────────────┐                    │
│                   │  services/api.ts            │                    │
│                   │  (Axios wrapper - 10 funcs) │                    │
│                   └──────────────┬──────────────┘                    │
│                                  │                                    │
│                      ┌───────────▼─────────────┐                     │
│                      │  styles/ (CSS 3 arquivos)                    │
│                      │  - global.css                               │
│                      │  - questoes.css                             │
│                      │  - gerar-provas.css                         │
│                      │  - corrigir.css                             │
│                      └───────────────────────┘                     │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ HTTP (axios/fetch)
                           │ localhost:4000
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Express/Node.js)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    index.ts (Express App)                       │    │
│  │  - Middleware: CORS, JSON parser, multer                      │    │
│  │  - GET /health → {status: "ok"}                               │    │
│  └──────────────┬────────────┬────────────┬───────────────────────┘    │
│                 │            │            │                             │
│          ┌──────▼──┐  ┌──────▼───┐  ┌───▼────────────┐                 │
│          │questões │  │  provas  │  │gerar-provas    │                 │
│          │Routes   │  │Routes    │  │Routes          │                 │
│          └──────┬──┘  └────┬─────┘  └───┬────────────┘                 │
│                 │         │            │                               │
│                 │         │            └──────┬──────────────┐         │
│                 │         │                   │              │         │
│          ┌──────▼────┬────▼──────────────────▼──────┐        │         │
│          │   storageService.ts                      │        │         │
│          │  ┌─────────────────────────────────────┐ │        │         │
│          │  │ CRUD Functions:                     │ │        │         │
│          │  │ - listarQuestoes/obterQuestao       │ │        │         │
│          │  │ - criarQuestao/atualizarQuestao     │ │        │         │
│          │  │ - deletarQuestao                    │ │        │         │
│          │  │ - listarProvas/obterProva           │ │        │         │
│          │  │ - criarProva/atualizarProva         │ │        │         │
│          │  │ - deletarProva                      │ │        │         │
│          │  └─────────────────────────────────────┘ │        │         │
│          └──────────────────────┬────────────────────┘        │         │
│                                 │                            │         │
│                                 ▼                            │         │
│                        ┌──────────────────┐                 │         │
│                        │   data.json      │                 │         │
│                        │  (Persistence)   │                 │         │
│                        └──────────────────┘                 │         │
│                                                              │         │
│          ┌────────────────────────────────────────────────────┼────┐   │
│          │                                                    │    │   │
│          │       provaGeneratorService.ts                    │    │   │
│          │                                                    │    │   │
│          │   ┌─────────────────────────────────────────┐    │    │   │
│          │   │ generateProvasAndGabarito()              │────┼────┘   │
│          │   │ - embaralhadorQuestoes()                 │    │        │
│          │   │ - shuffleArray()                         │    │        │
│          │   │ - generateSingleProva()                  │    │        │
│          │   │ - generatePDFFromProva() [pdfkit]        │    │        │
│          │   │ - createGabaritoCSV()                    │    │        │
│          │   └─────────────────────────────────────────┘    │        │
│          │                     │                            │        │
│          │      ┌──────────────▼──────────────┐             │        │
│          │      │  PDFs (Buffer) + CSV         │             │        │
│          │      │  Stored in-memory Map        │             │        │
│          │      │  (30-min auto-cleanup)       │             │        │
│          │      └──────────────┬───────────────┘             │        │
│          │                     │                            │        │
│          │      ┌──────────────▼──────────────┐             │        │
│          │      │ Stream downloads on request │─────────────┘        │
│          │      │ /baixar-provas/:id/:num     │                      │
│          │      │ /baixar-gabarito/:id        │                      │
│          │      └──────────────────────────────┘                      │
│          │                                                            │
│          └────────────────────────────────────────────────────────────┘
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model Diagram

```
┌─────────────────────┐
│    Alternativa      │
├─────────────────────┤
│ id: uuid            │
│ descricao: string   │
│ correta: boolean    │
└──────────┬──────────┘
           │ (array)
           │
┌──────────▼──────────┐
│     Questão         │
├─────────────────────┤
│ id: uuid            │
│ enunciado: string   │
│ alternativas: []    │
└───────────┬─────────┘
            │ (ref)
            │
┌───────────▼──────────┐
│      Prova           │
├──────────────────────┤
│ id: uuid             │
│ nome: string         │
│ questoesIds: []      │
│ identificacaoAltern. │ ← "letras" | "potencias"
└──────────────────────┘
            │
            │ (generated from)
            ▼
┌────────────────────────────┐
│ GabaritoProva (array)      │
├────────────────────────────┤
│ numeroProva: number        │
│ respostas: ["A","B","C"...]│
└────────────────────────────┘
```

---

## 🔄 Fluxos de Requisição HTTP

### Criar Questão
```
POST /api/questoes
Content-Type: application/json

{
  "enunciado": "Capital do Brasil?",
  "alternativas": [
    { "id": "uuid", "descricao": "Brasília", "correta": true },
    { "id": "uuid", "descricao": "Rio", "correta": false }
  ]
}

Response 201:
{
  "id": "new-uuid",
  "enunciado": "...",
  "alternativas": [...]
}
```

### Criar Prova
```
POST /api/provas
Content-Type: application/json

{
  "nome": "Prova de Geografia",
  "questoesIds": ["uuid1", "uuid2"],
  "identificacaoAlternativas": "letras"
}

Response 201:
{
  "id": "new-uuid",
  "nome": "...",
  "questoesIds": [...],
  "identificacaoAlternativas": "letras"
}
```

### Gerar Provas
```
POST /api/gerar-provas
Content-Type: application/json

{
  "provaId": "uuid-da-prova",
  "quantidade": 5
}

Response 200:
{
  "success": true,
  "message": "5 prova(s) gerada(s) com sucesso",
  "generationId": "gen-uuid-12345",
  "quantidade": 5,
  "gabarito": "numeroProva,respostas\n1,\"A,B,C,D\"\n..."
}
```

### Baixar PDF
```
GET /api/baixar-provas/gen-uuid-12345/1

Response 200:
[PDF Binary Data]
Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="prova_1.pdf"
```

### Baixar Gabarito
```
GET /api/baixar-gabarito/gen-uuid-12345

Response 200:
[CSV Text Data]
Headers:
  Content-Type: text/csv
  Content-Disposition: attachment; filename="gabarito_gen-uuid-12345.csv"
```

---

## 🎨 UI State Management

```
GerarProvas Component States:
├── Initial State
│   ├── provas: []
│   ├── selectedProvaId: ""
│   ├── quantidade: 5
│   ├── loading: false
│   ├── error: null
│   └── geracao: null
│
├── Form State (loading WHILE generating)
│   └── loading: true
│
└── Results State (AFTER successful generation)
    └── geracao: { generationId, quantidade, gabarito }
        ├── Download buttons active
        ├── CSV preview visible
        └── "Gerar Novas Provas" button

Transitions:
  Initial → Loading → Results (success)
  Initial → Initial (error + error message)
```

---

## 🔒 Validation Pipeline

```
Input → Frontend Validation → HTTP → Server Validation → Storage
         (basic checks)        │     (strict checks)
                               ▼
                         Accept/Reject + Message
```

---

## 📁 Build Outputs

```
After 'npm run build':

server/dist/
├── index.js
├── services/
│   ├── storageService.js
│   └── provaGeneratorService.js
└── routes/
    ├── questoesRoutes.js
    ├── provasRoutes.js
    └── geraProvasRoutes.js

client/dist/
├── index.html
└── assets/
    ├── index-HASH.css (8.98 kB)
    └── index-HASH.js  (216.48 kB gzip: 71.91 kB)
```

---

## 🧪 Test Architecture

```
Cucumber (Acceptance Tests)
├── cucumber.js (configuration)
├── features/
│   └── criar_prova.feature
│       └── Scenario: Verificar rota de saúde do servidor
└── features/step_definitions/
    └── criar_prova.steps.ts
        └── 3 steps: Given → When → Then

Current Status: 1 basic feature (health check)
TODO: Feature complete com CRUD + PDF generation
```

