# Componente CorrigirProvas - Documentação

## O que é?

`CorrigirProvas` é um componente React reutilizável que encapsula toda a lógica de correção automática de provas. Pode ser importado e usado em qualquer página da aplicação.

## Características

✅ Upload duplo de arquivos (gabarito + respostas)  
✅ Seletor de modo de correção (rigoroso/proporcional)  
✅ Validação de entrada e tratamento de erros  
✅ Tabela de resultados com badges de status  
✅ Download automático de CSV (opcional)  
✅ Callbacks para sucesso/erro  
✅ Estados de loading e mensagens de feedback  
✅ Reutilizável em múltiplas páginas  

## Importação

```typescript
import { CorrigirProvas } from '../components/CorrigirProvas';
```

Ou:

```typescript
import { CorrigirProvas } from '../components';
```

## Props

```typescript
interface CorrigirProvasProps {
  onSuccess?: (resultados: ResultadoCorrecao[]) => void;  // Callback de sucesso
  onError?: (error: string) => void;                      // Callback de erro
  autoDownload?: boolean;                                 // Auto-download CSV (padrão: true)
}
```

### Propriedades

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onSuccess` | `(resultados) => void` | - | Chamado quando a correção for concluída |
| `onError` | `(error) => void` | - | Chamado quando ocorrer um erro |
| `autoDownload` | `boolean` | `true` | Se true, baixa CSV automaticamente após correção |

## Uso Básico

### Exemplo 1: Uso mínimo
```typescript
import { CorrigirProvas } from '../components';

function MinhaPage() {
  return (
    <div>
      <h1>Corrigir Provas</h1>
      <CorrigirProvas />
    </div>
  );
}
```

### Exemplo 2: Com handlers
```typescript
import { CorrigirProvas, ResultadoCorrecao } from '../components';

function MinhaPage() {
  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    console.log('Sucesso! Corrigidas', resultados.length, 'provas');
    // Enviar para backend, atualizar dashboard, etc.
  };

  const handleError = (error: string) => {
    console.error('Erro:', error);
    // Mostrar notificação, log, etc.
  };

  return (
    <div>
      <h1>Corrigir Provas</h1>
      <CorrigirProvas onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
```

### Exemplo 3: Sem auto-download
```typescript
<CorrigirProvas 
  onSuccess={handleSuccess} 
  onError={handleError}
  autoDownload={false}  // Usuário clica botão de download manualmente
/>
```

## Fluxo de Uso

1. **Upload** → Usuário seleciona 2 arquivos CSV
2. **Validação** → Componente valida se ambos estão selecionados
3. **Envio** → Clica botão "✓ Corrigir Provas"
4. **Processamento** → Spinner de loading enquanto API processa
5. **Sucesso** → Tabela com resultados é exibida
6. **Download** → Auto-download CSV (se `autoDownload=true`) ou botão manual
7. **Reset** → Usuário pode corrigir novo arquivo

## Estados Visuais

### 1. Formulário Vazio
```
Arquivo de Gabarito (CSV)
[Browse...]

Arquivo de Respostas (CSV)
[Browse...]

Modo: [Rigoroso v]

[✓ Corrigir Provas] (desabilitado)
```

### 2. Arquivos Selecionados
```
✓ meu_gabarito.csv (2.5 KB)
✓ respostas_turma.csv (5.8 KB)

Modo: [Rigoroso v]

[✓ Corrigir Provas] (habilitado)
```

### 3. Carregando
```
⏳ Processando provas e gerando resultados...
```

### 4. Sucesso
```
✓ Correção Realizada com Sucesso!
15 prova(s) corrigida(s) em modo rigoroso

[Tabela com resultados]

[📥 Baixar Resultados] [Corrigir Outro Arquivo]
```

### 5. Erro
```
❌ [mensagem de erro]

[Formulário visível novamente para retry]
```

## Dados de Entrada (CSV)

### Gabarito
```csv
numeroProva,respostas
1,"A,B,C,D,A"
2,"D,C,B,A,D,C"
```

### Respostas
```csv
nomeAluno,numeroProva,respostas
João Silva,1,"A,B,C,D,A"
Maria Santos,1,"A,B,C,A,A"
```

## Dados de Saída

**Objeto ResultadoCorrecao:**
```typescript
{
  nomeAluno: string;           // "João Silva"
  numeroProva: number;         // 1
  acertos: number;             // 4
  total: number;               // 5
  percentual: number;          // 80
  status: string;              // "Bom"
}
```

**Status por Percentual:**
- 🟢 **Excelente**: 80%+
- 🔵 **Bom**: 60-79%
- 🟡 **Regular**: 40-59%
- 🔴 **Insuficiente**: <40%

## Modos de Correção

### Rigoroso (Padrão)
- 1 ponto se a resposta está **completamente correta**
- 0 pontos se há **qualquer erro**
- Nota final: (acertos / total) × 100%

**Exemplo:**
```
Gabarito: A
Resposta: A → ✓ 1 ponto
Resposta: B → ✗ 0 pontos
```

### Proporcional
- Estrutura pronta para avaliação proporcional
- Atualmente calcula igual ao rigoroso
- Futuro: suportar questões com múltiplas respostas corretas

## Integração com Outras Páginas

### Página de Correção Atual (Corrigir.tsx)
```typescript
import { CorrigirProvas } from '../components';

export function Corrigir() {
  const handleSuccess = (resultados) => {
    console.log('Correção concluída:', resultados.length);
  };

  return (
    <div className="corrigir-container">
      <h1>Corrigir Provas</h1>
      <CorrigirProvas 
        onSuccess={handleSuccess} 
        autoDownload={true} 
      />
    </div>
  );
}
```

### Dashboard Hipotético
```typescript
import { CorrigirProvas } from '../components';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);

  return (
    <div>
      <h1>Painel Administrativo</h1>
      
      <CorrigirProvas
        onSuccess={(resultados) => {
          setStats({
            total: resultados.length,
            media: resultados.reduce((a, b) => a + b.percentual, 0) / resultados.length
          });
        }}
      />
      
      {stats && (
        <div>
          <p>Total corrigido: {stats.total}</p>
          <p>Média: {stats.media.toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
```

## Tratamento de Erros

O componente trata automaticamente:

❌ **Arquivo não selecionado**
```
"Selecione o arquivo de gabarito"
"Selecione o arquivo de respostas"
```

❌ **Formato CSV inválido**
```
"Erro ao corrigir provas: Formato CSV inválido..."
```

❌ **Arquivo corrompido**
```
"Erro ao corrigir provas: desconhecido"
```

Erros são passados via callback `onError` para logging/notificação.

## Customização de Estilos

O componente usa classes CSS do arquivo `corrigir.css`:

```css
.corrigidor-form {}
.form-group {}
.btn-primary {}
.btn-success {}
.btn-secondary {}
.error-message {}
.sucesso-message {}
.loading-spinner {}
.resultados-table {}
.score-badge {}
```

Para customizar cores, edite `client/src/components/corrigir.css`.

## Estados Internos

O componente gerencia:

```typescript
gabaritoFile: File | null;          // Arquivo selecionado
respostasFile: File | null;         // Arquivo selecionado
modo: 'rigoroso' | 'proporcional';  // Modo escolhido
loading: boolean;                    // Durante processamento
error: string | null;                // Mensagem de erro
success: boolean;                    // Sucesso do envio
resultados: ResultadoCorrecao[];    // Resultados da correção
```

Não é necessário gerenciar esses manualmente no componente pai.

## Performance

- ✅ Upload rápido (buffers em memória)
- ✅ Parsing eficiente (sem loops aninhados)
- ✅ Tabela otimizada (sem re-renders desnecessários)
- ✅ CSV pequeno (<10KB para 100 alunos)

## Acessibilidade

- ✅ Labels associados aos inputs
- ✅ Mensagens de erro claras
- ✅ Estados visuais distintos (disabled, loading)
- ✅ Buttons com textos descritivos

## Suporte a Navegadores

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## Roadmap Futuro

- [ ] Arrastar e soltar para upload
- [ ] Preview de dados antes de processar
- [ ] Cancelamento de requisição em andamento
- [ ] Histórico de correções
- [ ] Exportação em Excel (.xlsx)
- [ ] Validação de CSV antes de enviar
- [ ] Suporte a múltiplas respostas corretas por questão

## FAQ

**P: Posso usar este componente fora de React?**
R: Não, é um componente React. Seria necessário criar um wrapper para outras frameworks.

**P: Como salvar os resultados em banco de dados?**
R: Use o callback `onSuccess` para enviar dados a um endpoint customizado:
```typescript
onSuccess={(resultados) => {
  fetch('/api/salvar-resultados', {
    method: 'POST',
    body: JSON.stringify(resultados)
  });
}}
```

**P: Posso mudar o modo após correção?**
R: Sim, mas será necessário fazer upload novamente. O componente valida e reprocessa tudo.

**P: Qual é o tamanho máximo de arquivo?**
R: Não há limite no cliente, mas o servidor pode ter limites (multer default: 50MB).

---

**Versão**: 1.0  
**Última atualização**: Implementação completa  
**Status**: Pronto para produção
