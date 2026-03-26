import React, { useEffect, useState } from 'react';
import { Prova, Questao } from '../types';
import { getProvas, deleteProva, getQuestoes } from '../services/api';
import { ProvaForm } from './ProvaForm';
import { GerarProvasModal } from './GerarProvasModal';
import './questoes.css';

export function ProvasList() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProva, setSelectedProva] = useState<Prova | undefined>(undefined);
  const [showGerarModal, setShowGerarModal] = useState(false);
  const [provaParaGerar, setProvaParaGerar] = useState<Prova | undefined>(undefined);

  useEffect(() => {
    fetchProvas();
    fetchQuestoes();
  }, []);

  const fetchProvas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProvas();
      setProvas(data);
    } catch (err) {
      setError('Erro ao carregar provas: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestoes = async () => {
    try {
      const data = await getQuestoes();
      setQuestoes(data);
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
    }
  };

  const getQuestaoTexto = (questaoId: string) => {
    const questao = questoes.find((q) => q.id === questaoId);
    return questao ? questao.enunciado : `Questão ${questaoId}`;
  };

  const handleNewProva = () => {
    setSelectedProva(undefined);
    setShowForm(true);
  };

  const handleEditProva = (prova: Prova) => {
    setSelectedProva(prova);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta prova?')) {
      return;
    }
    try {
      await deleteProva(id);
      await fetchProvas();
    } catch (err) {
      alert('Erro ao deletar: ' + (err instanceof Error ? err.message : 'desconhecido'));
    }
  };

  const handleFormSave = async (prova: Prova) => {
    await fetchProvas();
    setShowForm(false);
    setSelectedProva(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProva(undefined);
  };

  const handleGerarProvas = (prova: Prova) => {
    setProvaParaGerar(prova);
    setShowGerarModal(true);
  };

  const handleGerarCancel = () => {
    setShowGerarModal(false);
    setProvaParaGerar(undefined);
  };

  return (
    <div className="questoes-container">
      <h1>Gerenciar Provas</h1>

      <button className="btn-primary" onClick={handleNewProva}>
        + Nova Prova
      </button>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Carregando provas...</div>}

      {!loading && provas.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma prova encontrada.</p>
          <p>Clique em "+ Nova Prova" para criar a primeira.</p>
        </div>
      )}

      {!loading && provas.length > 0 && (
        <ul className="questao-list">
          {provas.map((p) => (
            <li key={p.id} className="questao-item">
              <h3>{p.nome}</h3>
              <div className="prova-info">
                <p>
                  <strong>Identificação das alternativas:</strong>{' '}
                  {p.identificacaoAlternativas === 'letras' ? 'Letras (A, B, C, ...)' : 'Potências (2¹, 2², ...)'}
                </p>
                <p>
                  <strong>Questões ({p.questoesIds.length}):</strong>
                </p>
                <ol style={{ marginLeft: '2rem' }}>
                  {p.questoesIds.map((qId) => (
                    <li key={qId}>{getQuestaoTexto(qId)}</li>
                  ))}
                </ol>
              </div>
              <div className="questao-actions">
                <button
                  className="btn-success"
                  onClick={() => handleGerarProvas(p)}
                >
                  📄 Gerar Provas
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleEditProva(p)}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <ProvaForm
          prova={selectedProva}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {showGerarModal && provaParaGerar && (
        <GerarProvasModal
          prova={provaParaGerar}
          onClose={handleGerarCancel}
        />
      )}
    </div>
  );
}
