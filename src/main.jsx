import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import MaintenancePage from './MaintenancePage';
import './i18n';
import './index.css';

const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isMaintenanceMode ? (
      <MaintenancePage />
    ) : (
      <HashRouter>
        <App />
      </HashRouter>
    )}
    <Analytics />
  </React.StrictMode>
);
