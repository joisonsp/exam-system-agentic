import React, { useState, useEffect } from 'react';
import { Questao, Alternativa } from '../types';
import { createQuestao, updateQuestao } from '../services/api';

interface QuestaoFormProps {
  questao?: Questao;
  onSave: (questao: Questao) => void;
  onCancel: () => void;
}

export function QuestaoForm({ questao, onSave, onCancel }: QuestaoFormProps) {
  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questao) {
      setEnunciado(questao.enunciado);
      setAlternativas([...questao.alternativas]);
    } else {
      setEnunciado('');
      setAlternativas([
        { id: 'a', descricao: '', correta: false },
        { id: 'b', descricao: '', correta: false },
        { id: 'c', descricao: '', correta: false }
      ]);
    }
  }, [questao]);

  const handleEnunciadoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnunciado(e.target.value);
  };

  const handleAlternativaChange = (index: number, descricao: string) => {
    const newAlternativas = [...alternativas];
    newAlternativas[index].descricao = descricao;
    setAlternativas(newAlternativas);
  };

  const handleAlternativaCorretaChange = (index: number) => {
    const newAlternativas = alternativas.map((alt, idx) => ({
      ...alt,
      correta: idx === index
    }));
    setAlternativas(newAlternativas);
  };

  const handleAddAlternativa = () => {
    const newId = String.fromCharCode(97 + alternativas.length); // a, b, c, d, ...
    setAlternativas([
      ...alternativas,
      { id: newId, descricao: '', correta: false }
    ]);
  };

  const handleRemoveAlternativa = (index: number) => {
    if (alternativas.length <= 2) {
      setError('Mínimo 2 alternativas obrigatório');
      return;
    }
    setAlternativas(alternativas.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!enunciado.trim()) {
      setError('Enunciado é obrigatório');
      return;
    }

    if (alternativas.length < 2) {
      setError('Mínimo 2 alternativas obrigatório');
      return;
    }

    const temCorreta = alternativas.some(alt => alt.correta);
    if (!temCorreta) {
      setError('Marque pelo menos uma alternativa como correta');
      return;
    }

    const temDescricaoVazia = alternativas.some(alt => !alt.descricao.trim());
    if (temDescricaoVazia) {
      setError('Todas as alternativas devem ter descrição');
      return;
    }

    try {
      setLoading(true);
      let savedQuestao: Questao;

      if (questao) {
        savedQuestao = await updateQuestao(questao.id, {
          enunciado,
          alternativas
        });
      } else {
        savedQuestao = await createQuestao({
          enunciado,
          alternativas
        });
      }

      onSave(savedQuestao);
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
          <h2>{questao ? 'Editar Questão' : 'Nova Questão'}</h2>
          <button type="button" className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="enunciado">Enunciado</label>
            <textarea
              id="enunciado"
              value={enunciado}
              onChange={handleEnunciadoChange}
              placeholder="Digite a pergunta da questão"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Alternativas</label>
            <div className="alternativas-list">
              {alternativas.map((alt, idx) => (
                <div key={alt.id} className="alt-item">
                  <input
                    type="text"
                    value={alt.descricao}
                    onChange={(e) => handleAlternativaChange(idx, e.target.value)}
                    placeholder={`Alternativa ${alt.id.toUpperCase()}`}
                    disabled={loading}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={alt.correta}
                      onChange={() => handleAlternativaCorretaChange(idx)}
                      disabled={loading}
                    />
                    Correta
                  </label>
                  {alternativas.length > 2 && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleRemoveAlternativa(idx)}
                      disabled={loading}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add-alt"
              onClick={handleAddAlternativa}
              disabled={loading}
            >
              + Adicionar Alternativa
            </button>
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
