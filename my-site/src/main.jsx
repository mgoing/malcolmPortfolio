import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Text, AppRegistry} from 'react-native';
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');
if (!container) {
  console.error('React root element #root not found in index.html');
} else {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
