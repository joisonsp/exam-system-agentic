import React from 'react';
import { CorrigirProvas } from '../components/CorrigirProvas';
import { ResultadoCorrecao } from '../services/api';
import '../components/corrigir.css';

export function Corrigir() {
  const handleSuccess = (resultados: ResultadoCorrecao[]) => {
    console.log('Correção concluída:', resultados.length, 'provas');
  };

  const handleError = (error: string) => {
    console.error('Erro na correção:', error);
  };

  return (
    <div className="corrigir-container">
      <h1>Corrigir Provas</h1>

      <div className="file-info" style={{ marginBottom: '2rem' }}>
        <p>
          <strong>Formatos esperados dos CSVs:</strong>
          <br />
          <br />
          <strong>Gabarito:</strong> <code>numeroProva,respostas</code>
          <br />
          Exemplo: <code>1,"A,B,C,D,A"</code>
          <br />
          <br />
          <strong>Respostas:</strong> <code>nomeAluno,numeroProva,respostas</code>
          <br />
          Exemplo: <code>João Silva,1,"A,B,C,A,A"</code>
        </p>
      </div>

      <CorrigirProvas onSuccess={handleSuccess} onError={handleError} autoDownload={true} />
    </div>
  );
}
