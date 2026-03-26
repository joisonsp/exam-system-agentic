import React, { useState } from 'react';
import { corrigirProvas, downloadResultadosCSV, ResultadoCorrecao } from '../services/api';
import '../components/corrigir.css';

interface CorrigirProvasProps {
  onSuccess?: (resultados: ResultadoCorrecao[]) => void;
  onError?: (error: string) => void;
  autoDownload?: boolean;
}

export function CorrigirProvas({ onSuccess, onError, autoDownload = true }: CorrigirProvasProps) {
  const [gabaritoFile, setGabaritoFile] = useState<File | null>(null);
  const [respostasFile, setRespostasFile] = useState<File | null>(null);
  const [modo, setModo] = useState<'rigoroso' | 'proporcional'>('rigoroso');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resultados, setResultados] = useState<ResultadoCorrecao[]>([]);

  const handleGabaritoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGabaritoFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleRespostasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRespostasFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gabaritoFile) {
      const msg = 'Selecione o arquivo de gabarito';
      setError(msg);
      onError?.(msg);
      return;
    }

    if (!respostasFile) {
      const msg = 'Selecione o arquivo de respostas';
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Call correction API
      const response = await corrigirProvas(gabaritoFile, respostasFile, modo);

      if (response.success) {
        setResultados(response.resultados);
        setSuccess(true);
        onSuccess?.(response.resultados);

        // Auto-download if enabled
        if (autoDownload) {
          await downloadResultadosCSV(gabaritoFile, respostasFile, modo);
        }
      } else {
        const msg = 'Erro ao corrigir provas';
        setError(msg);
        onError?.(msg);
      }
    } catch (err) {
      const msg = 'Erro ao corrigir provas: ' + (err instanceof Error ? err.message : 'desconhecido');
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGabaritoFile(null);
    setRespostasFile(null);
    setResultados([]);
    setError(null);
    setSuccess(false);
  };

  const getScoreBadgeClass = (percentual: number): string => {
    if (percentual >= 80) return 'excelente';
    if (percentual >= 60) return 'bom';
    if (percentual >= 40) return 'regular';
    return 'insuficiente';
  };

  return (
    <div>
      {/* Form Section */}
      <div className="corrigidor-form">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="sucesso-message">
              <h3>✓ Correção Realizada com Sucesso!</h3>
              <p>{resultados.length} prova(s) corrigida(s) em modo {modo}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="gabarito-input">Arquivo de Gabarito (CSV)</label>
            <input
              id="gabarito-input"
              type="file"
              accept=".csv"
              onChange={handleGabaritoChange}
              disabled={loading}
              required
            />
            {gabaritoFile && (
              <div className="file-info">
                ✓ <strong>{gabaritoFile.name}</strong> ({(gabaritoFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="respostas-input">Arquivo de Respostas (CSV)</label>
            <input
              id="respostas-input"
              type="file"
              accept=".csv"
              onChange={handleRespostasChange}
              disabled={loading}
              required
            />
            {respostasFile && (
              <div className="file-info">
                ✓ <strong>{respostasFile.name}</strong> ({(respostasFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="modo-selector">Modo de Correção</label>
            <select
              id="modo-selector"
              value={modo}
              onChange={(e) => setModo(e.target.value as 'rigoroso' | 'proporcional')}
              disabled={loading}
            >
              <option value="rigoroso">Rigoroso (1 ponto se correto, 0 se errado)</option>
              <option value="proporcional">Proporcional (porcentagem de acertos)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading || !gabaritoFile || !respostasFile}>
            {loading ? '⏳ Corrigindo...' : '✓ Corrigir Provas'}
          </button>

          {(gabaritoFile || respostasFile || success) && (
            <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
              Limpar Arquivos
            </button>
          )}
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-spinner">
          <p>Processando provas e gerando resultados...</p>
        </div>
      )}

      {/* Results Table */}
      {resultados.length > 0 && (
        <div className="correcao-resultados">
          <h2>Resultados da Correção</h2>
          <table className="resultados-table">
            <thead>
              <tr>
                <th>Nome do Aluno</th>
                <th>Nº Prova</th>
                <th>Acertos</th>
                <th>Percentual</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.nomeAluno}</td>
                  <td>{resultado.numeroProva}</td>
                  <td>
                    {resultado.acertos}/{resultado.total}
                  </td>
                  <td>{resultado.percentual.toFixed(1)}%</td>
                  <td>
                    <span className={`score-badge ${getScoreBadgeClass(resultado.percentual)}`}>
                      {resultado.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-success"
              onClick={() => {
                downloadResultadosCSV(gabaritoFile!, respostasFile!, modo).catch((err) => {
                  setError('Erro ao baixar CSV: ' + (err instanceof Error ? err.message : 'desconhecido'));
                });
              }}
            >
              📥 Baixar Resultados (CSV)
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Corrigir Outro Arquivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
