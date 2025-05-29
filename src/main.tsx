import { createRoot } from 'react-dom/client';
import '@/assets/styles/global.css';

import App from './App.tsx';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
);
