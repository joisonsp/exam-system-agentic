# Guia de Uso: Sistema de Correção de Provas

## Visão Geral

O sistema de correção permite que você:
1. Prepare um arquivo CSV com o **gabarito** (respostas corretas)
2. Prepare um arquivo CSV com as **respostas dos alunos**
3. Envie ambos os arquivos para correção automática
4. Receba uma tabela com notas e status de cada aluno

---

## Modos de Correção

### 1. Modo Rigoroso (Padrão)
- Cada questão vale **1 ponto** se a resposta estiver completamente correta
- A questão recebe **0 pontos** se houver qualquer erro
- **Nota final**: (total de acertos) / (total de questões) × 100%

**Exemplo:**
- Gabarito Q1: A
- Resposta Q1 (aluno): A → ✓ 1 ponto
- Resposta Q1 (outro aluno): B → ✗ 0 pontos

### 2. Modo Proporcional
- Cada questão é avaliada proporcionalmente
- Se a resposta está correta: 1 ponto (mesmo que modo rigoroso no resultado final)
- Se está errada: 0 pontos

**Nota:** No momento, ambos os modos produzem o mesmo resultado. Uma evolução futura pode permitir questões com múltiplas respostas corretas.

---

## Formato dos Arquivos CSV

### Arquivo de Gabarito

**Formato esperado:**
```
numeroProva,respostas
```

**Exemplo completo:**

```csv
numeroProva,respostas
1,"A,B,C,D,A,B"
2,"B,A,D,C,B,A"
3,"C,D,A,B,C,D"
```

**Regras importantes:**
- Primeira coluna: número da prova (número inteiro)
- Segunda coluna: respostas separadas por vírgula, envolvidas em aspas duplas
- As letras devem ser maiúsculas: A, B, C, D, etc.
- A ordem das respostas deve corresponder à ordem das questões na prova
- Não pode ter espaços após as vírgulas dentro das aspas

### Arquivo de Respostas dos Alunos

**Formato esperado:**
```
nomeAluno,numeroProva,respostas
```

**Exemplo completo:**

```csv
nomeAluno,numeroProva,respostas
João Silva,1,"A,B,C,D,A,B"
Maria Santos,1,"A,B,C,D,B,B"
Pedro Oliveira,1,"B,A,C,D,A,B"
Ana Costa,2,"B,A,D,C,B,A"
Carlos Mendes,2,"B,A,D,C,A,A"
```

**Regras importantes:**
- Primeira coluna: nome do aluno (pode conter espaços)
- Segunda coluna: número da prova (deve corresponder ao gabarito)
- Terceira coluna: respostas do aluno no mesmo formato do gabarito
- As letras devem ser maiúsculas: A, B, C, D, etc.
- Se o aluno deixou uma questão em branco, use uma posição vazia: "A,,C,D"

---

## Passo a Passo para Usar

### 1. Preparar os Arquivos

**Gabarito:**
- Crie um arquivo chamado `gabarito.csv`
- Adicione uma linha para cada prova diferente

**Respostas:**
- Crie um arquivo chamado `respostas.csv`
- Adicione uma linha para cada aluno/prova

### 2. Acessar a Página de Correção

1. No navegador, vá para `http://localhost:5173/corrigir`
2. Você verá um formulário com duas seções de upload

### 3. Fazer Upload dos Arquivos

1. Clique em "Upload do Arquivo de Gabarito (CSV)" e selecione `gabarito.csv`
2. Clique em "Upload do Arquivo de Respostas (CSV)" e selecione `respostas.csv`
3. Selecione o modo de correção (Rigoroso ou Proporcional)
4. Clique em "✓ Corrigir Provas"

### 4. Visualizar Resultados

Após a correção:
- Uma tabela mostrará:
  - **Nome do Aluno**
  - **Nº Prova** (referência)
  - **Acertos** (e.g., "5/6")
  - **Percentual** (e.g., "83.3%")
  - **Status** (Excelente/Bom/Regular/Insuficiente)

Badges de status:
- 🟢 **Excelente**: 80% ou mais
- 🔵 **Bom**: 60% a 79%
- 🟡 **Regular**: 40% a 59%
- 🔴 **Insuficiente**: Abaixo de 40%

### 5. Baixar Resultados

Clique em "📥 Baixar Resultados em CSV" para obter um arquivo com os resultados

---

## Tratamento de Erros

O sistema valida os arquivos e avisa sobre:

### ❌ Arquivo Gabarito Inválido
- Formato CSV incorreto
- Número de prova não é número inteiro
- Respostas sem aspas duplas

### ❌ Arquivo Respostas Inválido
- Formato CSV incorreto
- Número de prova não é número inteiro
- Nome do aluno vazio

### ❌ Desacordo entre Arquivos
- Prova na resposta sem gabarito correspondente → aviso e skip
- Quantidade diferente de questões → usa apenas até o limite do gabarito

---

## Exemplos de Uso

### Exemplo 1: Prova Simples com 5 Questões

**gabarito.csv:**
```csv
numeroProva,respostas
1,"A,B,D,C,A"
```

**respostas.csv:**
```csv
nomeAluno,numeroProva,respostas
Aluno 1,1,"A,B,D,C,A"
Aluno 2,1,"A,B,D,A,A"
Aluno 3,1,"B,B,D,C,B"
```

**Resultado esperado:**
- Aluno 1: 5/5 = 100% (Excelente)
- Aluno 2: 4/5 = 80% (Excelente)
- Aluno 3: 3/5 = 60% (Bom)

### Exemplo 2: Múltiplas Provas

**gabarito.csv:**
```csv
numeroProva,respostas
1,"A,B,C,D"
2,"D,C,B,A"
3,"B,A,D,C"
```

**respostas.csv:**
```csv
nomeAluno,numeroProva,respostas
João,1,"A,B,C,D"
Maria,1,"A,B,C,A"
João,2,"D,C,B,A"
Maria,2,"D,A,B,A"
Maria,3,"B,A,D,C"
```

**Resultado esperado:**
- João (Prova 1): 4/4 = 100%
- Maria (Prova 1): 3/4 = 75%
- João (Prova 2): 4/4 = 100%
- Maria (Prova 2): 2/4 = 50%
- Maria (Prova 3): 4/4 = 100%

### Exemplo 3: Com Respostas em Branco

**gabarito.csv:**
```csv
numeroProva,respostas
1,"A,B,C,D,A"
```

**respostas.csv:**
```csv
nomeAluno,numeroProva,respostas
Aluno 1,1,"A,B,,D,A"
```

**Resultado esperado:**
- Aluno 1: 4/5 = 80% (Excelente)
- Nota: A terceira questão (em branco) é considerada errada

---

## API Endpoint (Para Programadores)

### POST `/api/corrigir`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
- `gabarito` (arquivo): CSV do gabarito
- `respostas` (arquivo): CSV de respostas
- `modo` (query param): "rigoroso" ou "proporcional" (padrão: "rigoroso")

**Exemplos de requisição com curl:**

```bash
# Usando curl (Linux/Mac)
curl -X POST http://localhost:4000/api/corrigir \
  -F "gabarito=@gabarito.csv" \
  -F "respostas=@respostas.csv" \
  -G --data-urlencode "modo=rigoroso"

# Com opção de download direto
curl -X POST http://localhost:4000/api/corrigir \
  -F "gabarito=@gabarito.csv" \
  -F "respostas=@respostas.csv" \
  -G --data-urlencode "modo=rigoroso" \
  --data-urlencode "download=true" \
  -o resultados.csv
```

**Resposta (JSON):**
```json
{
  "success": true,
  "message": "3 prova(s) corrigida(s) com sucesso",
  "modo": "rigoroso",
  "resultados": [
    {
      "nomeAluno": "João Silva",
      "numeroProva": 1,
      "acertos": 5,
      "total": 5,
      "percentual": 100,
      "status": "Excelente"
    },
    ...
  ],
  "csv": "Nome do Aluno,Número Prova,Acertos,Total,Percentual (%),Status\n..."
}
```

**Query Parameters:**
- `modo`: "rigoroso" | "proporcional" (padrão: "rigoroso")
- `download`: "true" para retornar arquivo CSV ao invés de JSON

---

## Dicas e Boas Práticas

### ✅ Faça assim:
- Use UTF-8 encoding para arquivos CSV
- Mantenha a mesma ordem de questões em provas diferentes
- Valide seus CSVs em editor de texto antes de enviar
- Use nomes consistentes para estudar tendências

### ❌ Evite:
- Não coloque espaços nas respostas: "A, B, C" ❌ vs "A,B,C" ✓
- Não misture maiúsculas/minúsculas: "a,b,c" ❌ vs "A,B,C" ✓
- Não deixar linhas em branco no meio do CSV
- Não usar caracteres especiais nos nomes dos alunos

### 📊 Dicas para Análise:
- Baixe o CSV resultado para importar em Excel/Google Sheets
- Use filtros para encontrar alunos com dificuldade
- Compare percentuais entre provas para identificar padrões

---

## Troubleshooting

### Problema: "Formato CSV inválido"
**Solução:** Verifique se:
- As respostas estão entre aspas duplas: `"A,B,C,D"`
- Não há espaços após as vírgulas dentro das aspas
- Não há linhas em branco no CSV

### Problema: "Número de prova inválido"
**Solução:** Certifique-se de:
- A coluna de número da prova contém apenas números
- Não há letras ou caracteres especiais nessa coluna

### Problema: "Gabarito não encontrado para prova X"
**Solução:**
- Verifique se a prova existe no arquivo de gabarito
- Confirme se o número está correto em ambos os arquivos
- Note que esta prova será pulada nos resultados

### Problema: Resultados com porcentual não esperado
**Solução:**
- Verifique se a quantidade de respostas bate com o gabarito
- Confirme se não há espaços extras no CSV
- Teste com um exemplo simples primeiro

---

## Próximas Melhorias (Roadmap)

- [ ] Suportar múltiplas respostas corretas por questão
- [ ] Upload de imagens de respostas (OCR)
- [ ] Geração de relatórios detalhados (por questão)
- [ ] Identificação de padrões de erros
- [ ] Integração com planilhas Google
- [ ] Comparação de múltiplas turmas
- [ ] Histórico de correções

---

**Última atualização:** Sistema de Correção v1.0
**Status:** Pronto para uso
