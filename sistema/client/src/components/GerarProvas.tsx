import React, { useEffect, useState } from 'react';
import { getProvas, createProva } from '../services/api';
import { Prova } from '../types';
import './gerar-provas.css';

interface GeracaoInfo {
  generationId: string;
  quantidade: number;
  gabarito: string;
}

export function GerarProvas() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [selectedProvaId, setSelectedProvaId] = useState('');
  const [quantidade, setQuantidade] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingProvas, setLoadingProvas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geracao, setGeracao] = useState<GeracaoInfo | null>(null);
  const [downloadingGabarito, setDownloadingGabarito] = useState(false);

  useEffect(() => {
    fetchProvas();
  }, []);

  const fetchProvas = async () => {
    try {
      setLoadingProvas(true);
      const data = await getProvas();
      setProvas(data);
      if (data.length > 0) {
        setSelectedProvaId(data[0].id);
      }
    } catch (err) {
      setError('Erro ao carregar provas: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoadingProvas(false);
    }
  };

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 1000) {
      setQuantidade(value);
    }
  };

  const handleGerarProvas = async () => {
    if (!selectedProvaId) {
      setError('Selecione uma prova');
      return;
    }

    if (quantidade < 1 || quantidade > 1000) {
      setError('A quantidade deve estar entre 1 e 1000');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/gerar-provas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provaId: selectedProvaId,
          quantidade
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar provas');
      }

      const data = await response.json();
      setGeracao({
        generationId: data.generationId,
        quantidade: data.quantidade,
        gabarito: data.gabarito
      });
    } catch (err) {
      setError('Erro ao gerar provas: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGabarito = async () => {
    if (!geracao) return;

    try {
      setDownloadingGabarito(true);
      const response = await fetch(`http://localhost:4000/api/baixar-gabarito/${geracao.generationId}`);

      if (!response.ok) {
        throw new Error('Erro ao baixar gabarito');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gabarito_${geracao.generationId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao baixar gabarito: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setDownloadingGabarito(false);
    }
  };

  const handleDownloadProva = async (numero: number) => {
    if (!geracao) return;

    try {
      const response = await fetch(`http://localhost:4000/api/baixar-provas/${geracao.generationId}/${numero}`);

      if (!response.ok) {
        throw new Error(`Erro ao baixar prova ${numero}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prova_${numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao baixar prova: ' + (err instanceof Error ? err.message : 'desconhecido'));
    }
  };

  const handleDownloadTodasAsProvas = async () => {
    if (!geracao) return;

    try {
      setLoading(true);
      for (let i = 1; i <= geracao.quantidade; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200)); // Delay para não sobrecarregar
        await handleDownloadProva(i);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gerar-provas-container">
      <h1>Gerar Provas em PDF</h1>

      {error && <div className="error-message">{error}</div>}

      {!geracao && (
        <div className="gerador-form">
          <div className="form-group">
            <label htmlFor="prova-select">Selecione uma Prova</label>
            {loadingProvas ? (
              <p style={{ color: '#999' }}>Carregando provas...</p>
            ) : provas.length === 0 ? (
              <p style={{ color: '#999' }}>Nenhuma prova disponível</p>
            ) : (
              <select
                id="prova-select"
                value={selectedProvaId}
                onChange={(e) => setSelectedProvaId(e.target.value)}
                disabled={loading}
              >
                {provas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.questoesIds.length} questões)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade de Provas</label>
            <input
              id="quantidade"
              type="number"
              min="1"
              max="1000"
              value={quantidade}
              onChange={handleQuantidadeChange}
              disabled={loading}
            />
            <small>Entre 1 e 1000</small>
          </div>

          <button
            className="btn-primary"
            onClick={handleGerarProvas}
            disabled={loading || provas.length === 0}
          >
            {loading ? 'Gerando...' : 'Gerar Provas'}
          </button>
        </div>
      )}

      {geracao && (
        <div className="resultado-geracao">
          <div className="sucesso-message">
            <h2>✓ Provas Geradas com Sucesso!</h2>
            <p>{geracao.quantidade} prova(s) foram geradas.</p>
          </div>

          <div className="download-section">
            <h3>Downloads Disponíveis</h3>

            <div className="download-card">
              <h4>Gabarito (CSV)</h4>
              <p>Download do arquivo de gabarito com as respostas corretas para cada prova.</p>
              <button
                className="btn-success"
                onClick={handleDownloadGabarito}
                disabled={downloadingGabarito}
              >
                {downloadingGabarito ? 'Baixando...' : '📥 Baixar Gabarito'}
              </button>
            </div>

            <div className="download-card">
              <h4>Provas Individuais (PDF)</h4>
              <p>Baixe cada prova em PDF ou todas de uma vez.</p>

              <div className="provas-grid">
                {Array.from({ length: geracao.quantidade }).map((_, i) => (
                  <button
                    key={i + 1}
                    className="btn-secondary btn-small"
                    onClick={() => handleDownloadProva(i + 1)}
                  >
                    Prova {i + 1}
                  </button>
                ))}
              </div>

              <button className="btn-primary" onClick={handleDownloadTodasAsProvas}>
                📥 Baixar Todas as Provas
              </button>
            </div>

            <div className="gabarito-preview">
              <h4>Preview do Gabarito</h4>
              <pre>{geracao.gabarito}</pre>
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              setGeracao(null);
              setError(null);
            }}
          >
            Gerar Novas Provas
          </button>
        </div>
      )}

      {loading && !geracao && (
        <div className="loading-spinner">
          <p>Gerando provas...</p>
        </div>
      )}
    </div>
  );
}
