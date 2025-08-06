import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    navigate('/');
    localStorage.removeItem('aToken');
  };

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #ccc',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#007bff',
      margin: 0,
    },
    label: {
      padding: '0.2rem 0.6rem',
      border: '1px solid gray',
      borderRadius: '999px',
      fontSize: '0.9rem',
      color: 'gray',
      margin: 0,
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '0.5rem 1.5rem',
      border: 'none',
      borderRadius: '999px',
      cursor: 'pointer',
    }
  };

  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div style={styles.navbar}>
      <div style={styles.brand} onClick={() => navigate('/')}>
        <h1 style={styles.title}>TECHWORLD</h1>
        <p style={styles.label}>Admin</p>
      </div>
      {!isLoginPage && (
        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
