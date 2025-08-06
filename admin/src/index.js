import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppContextProvider from './context/AppContext'; // ✅ use your path
import AdminContextProvider from './context/AdminContext'; // if you also use AdminContext

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <AdminContextProvider>
        <App />
      </AdminContextProvider>
    </AppContextProvider>
  </React.StrictMode>
);
