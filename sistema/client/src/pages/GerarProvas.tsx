import React, { useEffect, useState } from 'react';
import { getProvas, gerarProvasZip } from '../services/api';
import { Prova } from '@shared/types';

export function GerarProvas() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [provaId, setProvaId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [professor, setProfessor] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const lista = await getProvas();
        setProvas(lista);
        if (lista.length > 0) {
          setProvaId(lista[0].id);
        }
      } catch (err) {
        setError('Falha ao carregar provas: ' + (err instanceof Error ? err.message : 'desconhecido'));
      }
    };

    fetchProvas();
  }, []);

  const handleGerarPDF = async () => {
    setError(null);
    setSuccess(null);

    if (!provaId) {
      setError('Selecione uma prova.');
      return;
    }

    if (quantidade < 1) {
      setError('Quantidade mínima de provas é 1.');
      return;
    }

    try {
      setLoading(true);
      const zipBlob = await gerarProvasZip(provaId, quantidade, professor.trim() || undefined, disciplina.trim() || undefined);

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `provas_geradas_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`Arquivo de provas gerado com sucesso! (${quantidade} provas, ZIP baixado)`);
    } catch (err) {
      setError('Erro ao gerar provas: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Gerar Provas em PDF</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="provaId">Selecione uma prova disponível:</label>
        <select
          id="provaId"
          value={provaId}
          onChange={(e) => setProvaId(e.target.value)}
          disabled={loading || provas.length === 0}
          style={{ marginLeft: '0.5rem', minWidth: '300px' }}
        >
          {provas.map((prova) => (
            <option key={prova.id} value={prova.id}>
              ID: {prova.id} - {prova.nome}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="quantidade">Quantidade de provas:</label>
        <input
          id="quantidade"
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
          disabled={loading}
          style={{ marginLeft: '0.5rem', width: '80px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="professor">Professor:</label>
        <input
          id="professor"
          type="text"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          disabled={loading}
          style={{ marginLeft: '0.5rem', minWidth: '300px' }}
          placeholder="Nome do professor"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="disciplina">Disciplina:</label>
        <input
          id="disciplina"
          type="text"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          disabled={loading}
          style={{ marginLeft: '0.5rem', minWidth: '300px' }}
          placeholder="Nome da disciplina"
        />
      </div>

      <button
        type="button"
        onClick={handleGerarPDF}
        disabled={loading || !provaId}
        style={{ padding: '0.5rem 1rem' }}
      >
        {loading ? 'Gerando...' : 'Gerar Provas em PDF + CSV'}
      </button>
    </div>
  );
}

