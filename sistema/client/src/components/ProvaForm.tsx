import React, { useState, useEffect } from 'react';
import { Prova } from '../types';
import { createProva, updateProva, getQuestoes } from '../services/api';
import { Questao } from '../types';

interface ProvaFormProps {
  prova?: Prova;
  onSave: (prova: Prova) => void;
  onCancel: () => void;
}

export function ProvaForm({ prova, onSave, onCancel }: ProvaFormProps) {
  const [nome, setNome] = useState('');
  const [questoesIds, setQuestoesIds] = useState<string[]>([]);
  const [identificacaoAlternativas, setIdentificacaoAlternativas] = useState<'letras' | 'potencias'>('letras');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingQuestoes, setLoadingQuestoes] = useState(true);

  useEffect(() => {
    fetchQuestoes();
  }, []);

  useEffect(() => {
    if (prova) {
      setNome(prova.nome);
      setQuestoesIds([...prova.questoesIds]);
      setIdentificacaoAlternativas(prova.identificacaoAlternativas);
    } else {
      setNome('');
      setQuestoesIds([]);
      setIdentificacaoAlternativas('letras');
    }
  }, [prova]);

  const fetchQuestoes = async () => {
    try {
      setLoadingQuestoes(true);
      const data = await getQuestoes();
      setQuestoes(data);
    } catch (err) {
      setError('Erro ao carregar questões: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoadingQuestoes(false);
    }
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleQuestaoToggle = (questaoId: string) => {
    setQuestoesIds((prev) =>
      prev.includes(questaoId)
        ? prev.filter((id) => id !== questaoId)
        : [...prev, questaoId]
    );
  };

  const handleIdentificacaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdentificacaoAlternativas(e.target.value as 'letras' | 'potencias');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) {
      setError('Nome da prova é obrigatório');
      return;
    }

    if (questoesIds.length === 0) {
      setError('Selecione pelo menos uma questão');
      return;
    }

    try {
      setLoading(true);
      let savedProva: Prova;

      if (prova) {
        savedProva = await updateProva(prova.id, {
          nome,
          questoesIds,
          identificacaoAlternativas
        });
      } else {
        savedProva = await createProva({
          nome,
          questoesIds,
          identificacaoAlternativas
        });
      }

      onSave(savedProva);
    } catch (err) {
      setError('Erro ao salvar: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{prova ? 'Editar Prova' : 'Nova Prova'}</h2>
          <button type="button" className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Prova</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={handleNomeChange}
              placeholder="Exemplo: Prova de Matemática - Turma A"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="identificacao">Identificação das Alternativas</label>
            <select
              id="identificacao"
              value={identificacaoAlternativas}
              onChange={handleIdentificacaoChange}
              disabled={loading}
            >
              <option value="letras">Letras (A, B, C, D, ...)</option>
              <option value="potencias">Potências (2¹, 2², 2³, ...)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Selecione as Questões</label>
            {loadingQuestoes ? (
              <p style={{ color: '#999' }}>Carregando questões...</p>
            ) : questoes.length === 0 ? (
              <p style={{ color: '#999' }}>Nenhuma questão disponível</p>
            ) : (
              <div className="questoes-checkboxes">
                {questoes.map((q) => (
                  <div key={q.id} className="checkbox-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={questoesIds.includes(q.id)}
                        onChange={() => handleQuestaoToggle(q.id)}
                        disabled={loading}
                      />
                      <span className="checkbox-label">
                        <strong>{q.enunciado}</strong>
                        <small>
                          {' '}
                          ({q.alternativas.length} alternativas)
                        </small>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            {questoesIds.length > 0 && (
              <p style={{ marginTop: '1rem', color: '#28a745' }}>
                <strong>{questoesIds.length}</strong> questões selecionadas
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-success" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
