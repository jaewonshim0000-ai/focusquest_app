// ──────────────────────────────────────────────────
// FocusQuest — Application Entry Point
// ──────────────────────────────────────────────────

import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App';

// Initialize Ionic PWA elements (camera, etc.)
defineCustomElements(window);

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
