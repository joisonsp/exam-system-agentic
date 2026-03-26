/**
 * Exemplos de uso do componente CorrigirProvas
 * Demonstra diferentes formas de integração e customização
 */

import { useState } from 'react';
import { CorrigirProvas } from '../components';
import { ResultadoCorrecao } from '../services/api';

// ============================================
// EXEMPLO 1: Uso Mínimo
// ============================================
function ExemploMinimo() {
  return (
    <div>
      <h1>Corrigir Provas</h1>
      {/* Valores padrão: autoDownload=true, sem callbacks */}
      <CorrigirProvas />
    </div>
  );
}

// ============================================
// EXEMPLO 2: Com Callbacks de Sucesso e Erro
// ============================================
function ExemploComCallbacks() {
  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    console.log('✓ Correção concluída!');
    console.log(`Total: ${resultados.length} provas`);
    
    // Calcular média
    const media = resultados.reduce((sum, r) => sum + r.percentual, 0) / resultados.length;
    console.log(`Média da turma: ${media.toFixed(1)}%`);
    
    // Identificar alunos com dificuldade
    const comDificuldade = resultados.filter((r) => r.percentual < 50);
    if (comDificuldade.length > 0) {
      console.log('Alunos com percentual < 50%:');
      comDificuldade.forEach((r) => {
        console.log(`  - ${r.nomeAluno}: ${r.percentual.toFixed(1)}%`);
      });
    }
  };

  const handleError = (error: string) => {
    console.error('✗ Erro na correção:', error);
    // Aqui você poderia mostrar um toast notification, por exemplo
    // toast.error(error);
  };

  return (
    <CorrigirProvas 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

// ============================================
// EXEMPLO 3: Download Manual (sem auto-download)
// ============================================
function ExemploDownloadManual() {
  return (
    <div>
      <p>Ao corrigir, você poderá clicar manualmente no botão de download</p>
      <CorrigirProvas autoDownload={false} />
    </div>
  );
}

// ============================================
// EXEMPLO 4: Com Estado Externo e Dashboard
// ============================================
function ExemploDashboard() {
  const [ultimoResultado, setUltimoResultado] = useState<{
    data: string;
    total: number;
    media: number;
  } | null>(null);

  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    const media = resultados.reduce((sum, r) => sum + r.percentual, 0) / resultados.length;
    
    setUltimoResultado({
      data: new Date().toLocaleString('pt-BR'),
      total: resultados.length,
      media: media
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h2>Corretor de Provas</h2>
        <CorrigirProvas onSuccess={handleSuccess} />
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Último Processamento</h2>
        {ultimoResultado ? (
          <>
            <p><strong>Data:</strong> {ultimoResultado.data}</p>
            <p><strong>Total:</strong> {ultimoResultado.total} provas</p>
            <p><strong>Média:</strong> {ultimoResultado.media.toFixed(1)}%</p>
          </>
        ) : (
          <p style={{ color: '#999' }}>Nenhuma correção realizada ainda</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXEMPLO 5: Modal com Componente
// ============================================
function ExemploEmModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Abrir Corretor</button>
      
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            
            <h2>Corrigir Provas</h2>
            <CorrigirProvas 
              onSuccess={() => {
                setTimeout(() => setIsOpen(false), 1000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXEMPLO 6: Com Validação Extra e Logging
// ============================================
function ExemploComValidacao() {
  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    // Validações customizadas
    if (resultados.length === 0) {
      console.warn('Nenhuma prova foi corrigida');
      return;
    }

    // Análise detalhada
    const stats = {
      total: resultados.length,
      aprovados: resultados.filter((r) => r.percentual >= 60).length,
      reprovados: resultados.filter((r) => r.percentual < 60).length,
      media: resultados.reduce((sum, r) => sum + r.percentual, 0) / resultados.length,
      melhorNota: Math.max(...resultados.map((r) => r.percentual)),
      piorNota: Math.min(...resultados.map((r) => r.percentual))
    };

    console.log('📊 Estatísticas:');
    console.table(stats);
    
    // Log JSON para exportar
    console.log('JSON para exportação:');
    console.log(JSON.stringify(resultados, null, 2));
  };

  const handleError = (error: string) => {
    console.error('[ERRO]', new Date().toISOString(), error);
    // Aqui você poderia enviar o erro para um serviço de logging
  };

  return (
    <CorrigirProvas 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

// ============================================
// EXEMPLO 7: Integração com Notificações
// ============================================
/* Assumindo que você tem uma biblioteca de toast/notificações */
// import { showNotification } from '../utils/notifications';

function ExemploComNotificacoes() {
  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    // showNotification({
    //   type: 'success',
    //   title: 'Sucesso!',
    //   message: `${resultados.length} prova(s) corrigida(s)`,
    //   duration: 3000
    // });

    console.log('✓ Notificação de sucesso seria mostrada');
  };

  const handleError = (error: string) => {
    // showNotification({
    //   type: 'error',
    //   title: 'Erro',
    //   message: error,
    //   duration: 5000
    // });

    console.error('✗ Notificação de erro seria mostrada');
  };

  return (
    <CorrigirProvas 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

// ============================================
// EXEMPLO 8: Com Histórico de Correções
// ============================================
function ExemploComHistorico() {
  const [historico, setHistorico] = useState<Array<{
    timestamp: string;
    total: number;
    resultados: ResultadoCorrecao[];
  }>>([]);

  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    setHistorico(prev => [...prev, {
      timestamp: new Date().toISOString(),
      total: resultados.length,
      resultados
    }]);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Nova Correção</h2>
        <CorrigirProvas onSuccess={handleSuccess} />
      </div>

      <div style={{ flex: 1, maxHeight: '500px', overflow: 'auto' }}>
        <h2>Histórico ({historico.length})</h2>
        {historico.map((item, idx) => (
          <div key={idx} style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <small>{new Date(item.timestamp).toLocaleString('pt-BR')}</small>
            <p><strong>{item.total} provas</strong></p>
            <small>
              Média: {(item.resultados.reduce((sum, r) => sum + r.percentual, 0) / item.total).toFixed(1)}%
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXPORTAR TODOS OS EXEMPLOS
// ============================================
export {
  ExemploMinimo,
  ExemploComCallbacks,
  ExemploDownloadManual,
  ExemploDashboard,
  ExemploEmModal,
  ExemploComValidacao,
  ExemploComNotificacoes,
  ExemploComHistorico
};
