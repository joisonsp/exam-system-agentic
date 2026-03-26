import React, { useState } from 'react';
import { Prova } from '../types';
import { gerarProvasZip } from '../services/api';
import './GerarProvasModal.css';

interface GerarProvasModalProps {
  prova: Prova;
  onClose: () => void;
}

export function GerarProvasModal({ prova, onClose }: GerarProvasModalProps) {
  const [quantidade, setQuantidade] = useState<number>(5);
  const [professor, setProfessor] = useState<string>('');
  const [disciplina, setDisciplina] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerarProvas = async () => {
    try {
      setLoading(true);
      setError(null);

      const zipBlob = await gerarProvasZip(prova.id, quantidade, professor.trim() || undefined, disciplina.trim() || undefined);

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `provas_${prova.nome.replace(/\s+/g, '_')}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gerar Provas em PDF</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="prova-nome">Prova Selecionada:</label>
            <input
              id="prova-nome"
              type="text"
              value={prova.nome}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">
              Quantidade de Provas: <span className="required">*</span>
            </label>
            <input
              id="quantidade"
              type="number"
              min="1"
              max="500"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-control"
            />
            <small>Máximo de 500 provas por geração</small>
          </div>

          <div className="form-group">
            <label htmlFor="professor">Professor(a):</label>
            <input
              id="professor"
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Nome do professor"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="disciplina">Disciplina:</label>
            <input
              id="disciplina"
              type="text"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              placeholder="Nome da disciplina"
              className="form-control"
            />
          </div>

          <div className="form-info">
            <p>
              <strong>Observações:</strong>
            </p>
            <ul>
              <li>Cada prova terá questões e alternativas em ordem aleatória</li>
              <li>Espaço para identificação do aluno (nome e CPF)</li>
              <li>Número único em cada prova para rastreamento</li>
              <li>Arquivo ZIP será baixado automaticamente contendo todas as provas em PDF e o gabarito em CSV</li>
            </ul>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={handleGenerarProvas}
              disabled={loading || quantidade < 1}
            >
              {loading ? 'Gerando...' : 'Gerar Provas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
