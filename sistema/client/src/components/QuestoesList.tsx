import React, { useEffect, useState } from 'react';
import { Questao } from '../types';
import { getQuestoes, deleteQuestao } from '../services/api';
import { QuestaoForm } from './QuestaoForm';
import './questoes.css';

export function QuestoesList() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestao, setSelectedQuestao] = useState<Questao | undefined>(undefined);

  useEffect(() => {
    fetchQuestoes();
  }, []);

  const fetchQuestoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestoes();
      setQuestoes(data);
    } catch (err) {
      setError('Erro ao carregar questões: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestao = () => {
    setSelectedQuestao(undefined);
    setShowForm(true);
  };

  const handleEditQuestao = (questao: Questao) => {
    setSelectedQuestao(questao);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) {
      return;
    }
    try {
      await deleteQuestao(id);
      await fetchQuestoes();
    } catch (err) {
      alert('Erro ao deletar: ' + (err instanceof Error ? err.message : 'desconhecido'));
    }
  };

  const handleFormSave = async (questao: Questao) => {
    await fetchQuestoes();
    setShowForm(false);
    setSelectedQuestao(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedQuestao(undefined);
  };

  return (
    <div className="questoes-container">
      <h1>Gerenciar Questões</h1>

      <button className="btn-primary" onClick={handleNewQuestao}>
        + Nova Questão
      </button>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Carregando questões...</div>}

      {!loading && questoes.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma questão encontrada.</p>
          <p>Clique em "+ Nova Questão" para criar a primeira.</p>
        </div>
      )}

      {!loading && questoes.length > 0 && (
        <ul className="questao-list">
          {questoes.map((q) => (
            <li key={q.id} className="questao-item">
              <h3>{q.enunciado}</h3>
              <div className="alternativas">
                {q.alternativas.map((alt) => (
                  <div key={alt.id} className="alternativa">
                    <span className="alternativa-text">
                      <strong>{alt.id.toUpperCase()}:</strong> {alt.descricao}
                    </span>
                    {alt.correta && <span style={{ fontWeight: 'bold', color: 'green' }}>✓</span>}
                  </div>
                ))}
              </div>
              <div className="questao-actions">
                <button
                  className="btn-secondary"
                  onClick={() => handleEditQuestao(q)}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(q.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <QuestaoForm
          questao={selectedQuestao}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}
