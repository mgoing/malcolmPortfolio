import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App-portfolio.jsx';
//for route to Example pages
 
const container = document.getElementById('root');
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 