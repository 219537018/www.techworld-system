// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// ✅ Import the default export
import AppContextProvider from './context/AppContext';  // Use default import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider> {/* Use the default AppContextProvider */}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
