import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ShopProvider } from './components/ShopProvider';
import { loadCatalog } from './data/catalog';
import './styles.css';

const container = document.getElementById('root');
container.textContent = 'Carregando catálogo…';
loadCatalog().then(() => {
  createRoot(container).render(
    <BrowserRouter><ShopProvider><App /></ShopProvider></BrowserRouter>,
  );
});
