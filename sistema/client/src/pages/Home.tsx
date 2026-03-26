import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Sistema de Provas</h1>
      <p>Bem-vindo! Escolha uma opção abaixo:</p>
      <nav style={{ marginTop: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/questoes" style={{ marginRight: '1rem' }}>
              Gerenciar Questões
            </Link>
          </li>
          <li>
            <Link to="/provas" style={{ marginRight: '1rem' }}>
              Gerenciar Provas
            </Link>
          </li>
          <li>
            <Link to="/gerar-provas">Gerar Prova em PDF</Link>
          </li>
          <li>
            <Link to="/corrigir">Corrigir Prova</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
