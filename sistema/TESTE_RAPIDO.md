# 🚀 Guia Rápido - Testando em 3 Minutos

## 1️⃣ Instalar (30 segundos)
```bash
npm install
```

## 2️⃣ Executar (2 minutos)

### Opção A: Automático (Recomendado)
```bash
npm run test:acceptance
```
Isso faz tudo:
- ✅ Compila servidor
- ✅ Inicia servidor em background
- ✅ Executa testes
- ✅ Gera relatório
- ✅ Encerra servidor

### Opção B: Manual
Terminal 1:
```bash
npm run dev:server
```

Terminal 2:
```bash
npm run test:cucumber
```

## 3️⃣ Ver Relatório (30 segundos)

Após os testes, abra:
```bash
open cucumber-report.html  # macOS
start cucumber-report.html # Windows
xdg-open cucumber-report.html # Linux
```

---

## 📊 Resultado Esperado

```
✓ 47 cenários
✓ 113 steps passando
⏱️  ~5-10 minutos
📄 Relatório HTML gerado
```

---

## 🔧 Solução de Problemas

### "Porta 4000 já em uso"
```bash
# Kill processo na porta
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Servidor não inicia"
```bash
# Build manual
npm run build --workspace=server
npm run build --workspace=client
```

### "Testes falham"
```bash
# Verbose mode
DEBUG=* npm run test:acceptance
```

---

## 📝 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `features//*.feature` | 47 cenários em Gherkin PT |
| `features/support/world.ts` | Contexto compartilhado |
| `features/step_definitions/` | 113 steps implementados |
| `cucumber.js` | Configuração Cucumber |
| `run-tests.ts` | Orquestrador de testes |
| `features/README.md` | Guia completo |

---

## ✨ Exemplos de Execução

### Apenas correção de provas
```bash
npx cucumber-js features/correcao_provas.feature
```

### Um cenário específico
```bash
npx cucumber-js --name "Corrigir prova em modo Rigoroso"
```

### Modo seco (validate steps)
```bash
npx cucumber-js --dry-run
```

---

## 📚 Aprenda Mais

Veja `features/README.md` para:
- Estrutura de testes
- Validações implementadas
- Exemplos détalhados
- Tips & troubleshooting

---

**Pronto? Execute:**
```bash
npm run test:acceptance
```

**Dúvidas? Veja:**
```bash
cat features/README.md
cat TESTES_IMPLEMENTACAO.md
```
