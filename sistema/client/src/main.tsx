import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home, Questoes, Provas, GerarProvas, Corrigir } from './pages';
import './global.css';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link to="/questoes" style={{ marginRight: '1rem' }}>
          Questões
        </Link>
        <Link to="/provas" style={{ marginRight: '1rem' }}>
          Provas
        </Link>
        <Link to="/gerar-provas" style={{ marginRight: '1rem' }}>
          Gerar Provas
        </Link>
        <Link to="/corrigir">Corrigir</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questoes" element={<Questoes />} />
        <Route path="/provas" element={<Provas />} />
        <Route path="/gerar-provas" element={<GerarProvas />} />
        <Route path="/corrigir" element={<Corrigir />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
