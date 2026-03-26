# 📚 Guia de Documentação - Sistema de Provas

## Bem-vindo! 👋

Este documento organiza o acesso à documentação completa do projeto. Escolha seu ponto de partida:

---

## 🚀 Começando (para novos usuários)

**Você é novo no projeto?** Comece aqui:

1. **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** (5 min)
   - O que é o projeto?
   - Principais funcionalidades
   - Como usar
   - Stack tecnológico

2. **[README.md](README.md)** (15 min)
   - Instalação passo-a-passo
   - Como rodar (dev e produção)
   - Descrição de cada rota
   - Troubleshooting

3. **Pronto!** Execute:
   ```bash
   npm install
   npm run dev:server  # Terminal 1
   npm run dev:client  # Terminal 2
   ```

---

## 🏗️ Arquitetura e Design

**Você quer entender como funciona?**

- **[ARCHITECTURE.md](ARCHITECTURE.md)** (20 min)
  - Diagramas de componentes
  - Fluxos de requisição HTTP
  - Data models
  - State management
  - Test architecture

- **[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)** (25 min)
  - Stack detalhado
  - Estrutura de diretórios completa
  - Status de cada componente
  - Validações implementadas
  - NOTOs futuros

---

## 💻 Desenvolvimento

**Você quer modificar/estender o código?**

### Frontend Tasks
- Adicionar novo componente → veja `client/src/components/`
- Criar nova página → veja `client/src/pages/` e React Router em `client/src/main.tsx`
- Chamar API → use `client/src/services/api.ts`
- Estilizar → adicione em `client/src/components/*.css` ou `client/src/global.css`

### Backend Tasks
- Novo endpoint → crie em `server/src/routes/`
- Lógica de negócio → adicione em `server/src/services/`
- Tipos compartilhados → edite `shared/types.ts`

### Build & Deploy
```bash
npm run build           # Build produção
npm run type-check      # TypeScript validation
npm run dev:*           # Modo desenvolvimento
npm run cucumber        # Testes de aceitação
```

---

## 📂 Estrutura de Pastas

```
workspace/
│
├── 📖 DOCUMENTAÇÃO (você está aqui)
│   ├── README.md                    ← Começa aqui (setup)
│   ├── EXECUTIVE_SUMMARY.md         ← Visão geral
│   ├── ARCHITECTURE.md              ← Diagramas técnicos
│   ├── TECHNICAL_DOCS.md            ← Especificações
│   └── DOCUMENTATION_INDEX.md       ← Este arquivo
│
├── 🖥️  CLIENT (Frontend React)
│   └── src/
│       ├── pages/                   ← 5 rotas principais
│       ├── components/              ← Componentes React
│       ├── services/api.ts          ← Chamadas HTTP
│       └── *.css                    ← Estilos
│
├── 🔌 SERVER (Backend Express)
│   └── src/
│       ├── routes/                  ← 3 arquivos de rotas
│       ├── services/                ← Lógica de negócio
│       └── index.ts                 ← Servidor principal
│
├── 📦 SHARED (Tipos TypeScript)
│   └── types.ts                     ← Interfaces compartilhadas
│
├── 🧪 FEATURES (Testes Cucumber)
│   ├── *.feature                    ← Cenários
│   └── step_definitions/            ← Implementações
│
└── 📊 DATA
    └── data.json                    ← Banco de dados local
```

---

## 🔍 Buscar por Tópico

### APIs & Endpoints
- Questões: [README.md#api-endpoints](README.md) → "Questões"
- Provas: [README.md#api-endpoints](README.md) → "Provas"
- Geração: [README.md#api-endpoints](README.md) → "Geração de Provas"

### Componentes React
- QuestoesList: [ARCHITECTURE.md](ARCHITECTURE.md) → Data Flow
- GerarProvas: [ARCHITECTURE.md](ARCHITECTURE.md) → UI State
- Todos: Veja `client/src/components/`

### Validation Rules
- Questão: [TECHNICAL_DOCS.md#validações-implementadas](TECHNICAL_DOCS.md)
- Prova: [TECHNICAL_DOCS.md#validações-implementadas](TECHNICAL_DOCS.md)
- Geração: [TECHNICAL_DOCS.md#validações-implementadas](TECHNICAL_DOCS.md)

### Fluxos
- Criar Questão: [TECHNICAL_DOCS.md#fluxos-principais](TECHNICAL_DOCS.md)
- Criar Prova: [TECHNICAL_DOCS.md#fluxos-principais](TECHNICAL_DOCS.md)
- Gerar PDFs: [TECHNICAL_DOCS.md#fluxos-principais](TECHNICAL_DOCS.md)
- Corrigir: [TECHNICAL_DOCS.md#fluxos-principais](TECHNICAL_DOCS.md) (TODO)

---

## 🎨 Guia de Estilo

### CSS Classes Disponíveis

**Buttons:**
```css
.btn-primary      /* Azul principal */
.btn-success      /* Verde sucesso */
.btn-secondary    /* Cinza neutro */
.btn-danger       /* Vermelho perigo */
.btn-small        /* Versão menor */
```

**Messages:**
```css
.error-message    /* Fundo vermelho, bordas */
.sucesso-message  /* Fundo verde, bordas */
.file-info        /* Info box azul */
```

**Forms:**
```css
.form-group       /* Input wrapper com label */
.corrigidor-form  /* Formulário completo */
```

Veja:
- `client/src/global.css` - Base global
- `client/src/components/questoes.css` - Componentes lista/form
- `client/src/components/gerar-provas.css` - Generation UI
- `client/src/components/corrigir.css` - Correction UI

---

## 🧪 Testes

### Testes de Aceitação (Cucumber)

Arquivo de feature:
```
features/criar_prova.feature
```

Executar:
```bash
npm run cucumber
```

Status: 1 feature básica criada (health check)
TODO: Expandir para CRUD + PDF geração

Veja [ARCHITECTURE.md#test-architecture](ARCHITECTURE.md) para diagrama.

---

## 🚀 Deploy/Produção

1. **Build:**
   ```bash
   npm run build
   ```

2. **Outputs:**
   - `server/dist/` → Node.js code
   - `client/dist/` → Static assets

3. **Servidor de Produção:**
   ```bash
   cd server
   npm install --production
   node dist/index.js
   ```

4. **Servir Frontend:**
   - Hospe `client/dist/` em CDN ou servidor estático
   - Configure `REACT_APP_API_URL` para apontar ao servidorvidor

Veja [README.md#produção](README.md) para mais detalhes.

---

## ❓ FAQ

**P: Como mudar a porta do servidor?**
R: Edite `server/src/index.ts`, linha com `const port = ...`

**P: Como adicionar autenticação?**
R: Implemente middleware no `server/src/index.ts` antes das rotas

**P: Posso usar banco de dados real?**
R: Sim! Substitua `storageService.ts` por um cliente PostgreSQL/MongoDB

**P: Como adicionar mais campos na prova?**
R: Edite `shared/types.ts`, atualize FormComponent, atualize API

---

## 📞 Escalação de Problemas

### Build falha?
- Veja [README.md#troubleshooting](README.md)
- Verifique TypeScript: `npm run type-check`

### API retorna erro?
- Confirme servidor está rodando: `npm run dev:server`
- Verifique logs no console
- Teste com `curl` ou Postman

### Componentes não aparecem?
- Confirme cliente está rodando: `npm run dev:client`
- Verifique console do navegador (F12)
- Confirme imports em `client/src/main.tsx`

### PDFs vazios?
- Verifique `provaGeneratorService.ts`
- Confirme prova tem questões
- Verifique pdfkit está instalado: `npm list pdfkit`

---

## 🔗 Links Rápidos

| Item | Link |
|------|------|
| Documentação Executiva | [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) |
| Setup Completo | [README.md](README.md) |
| Arquitetura Visual | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Specs Técnicas | [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) |
| Frontend | `client/src/` |
| Backend | `server/src/` |
| Tipos Compartilhados | `shared/types.ts` |
| Dados | `data.json` |

---

## 📈 Roadmap

- [x] Gestão de Questões (CRUD)
- [x] Gestão de Provas (CRUD)
- [x] Geração de PDFs com shuffling
- [x] CSV Gabarito
- [x] UI completa com estilagem
- [x] Documentação
- [ ] Implementar Correção (feature completa)
- [ ] Autenticação de usuários
- [ ] PostgreSQL integração
- [ ] Testes automatizados
- [ ] CI/CD pipeline

---

## 👥 Contato / Suporte

Para issues ou dúvidas:
1. Consulte [README.md#troubleshooting](README.md)
2. Verifique [TECHNICAL_DOCS.md#notes-de-segurança](TECHNICAL_DOCS.md)
3. Abra issue no repositório

---

## 📋 Checklist de Setup

Primeiro acesso?

- [ ] `npm install` → Instalar deps
- [ ] `npm run type-check` → TypeScript OK?
- [ ] Terminal 1: `npm run dev:server` → Backend rodando?
- [ ] Terminal 2: `npm run dev:client` → Frontend OK?
- [ ] Navegar para `http://localhost:5173` → Página carrega?
- [ ] Criar questão teste → Funciona?
- [ ] Criar prova → Funciona?
- [ ] Gerar PDF → Funciona?

Tudo ok? 🎉 Seu setup está pronto!

---

## 🎓 Próximos Passos

1. **Entender código**
   - Leia [ARCHITECTURE.md](ARCHITECTURE.md)
   - Explore estrutura do projeto

2. **Fazer primeira modificação**
   - Edite componente em `client/src/components/`
   - Execute `npm run dev:client` e veja resultado

3. **Adicionar feature**
   - Defina tipo em `shared/types.ts`
   - Implemente endpoint em `server/src/routes/`
   - Crie componente em `client/src/components/`
   - Integre em página em `client/src/pages/`

4. **Deploy**
   - Execute `npm run build`
   - Siga instruções de produção

---

## 📝 Versionamento

- **Projeto**: Sistema de Provas v1.0
- **React**: 18.3.1
- **Node**: 16+ recomendado
- **TypeScript**: 5.1.6

---

**Última atualização**: Sessão atual
**Status**: Pronto para uso e desenvolvimento

Aproveite o projeto! 🚀
