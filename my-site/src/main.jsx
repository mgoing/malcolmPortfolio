import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
//for route to RetroDesktop

const container = document.getElementById('root');
createRoot(container).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);