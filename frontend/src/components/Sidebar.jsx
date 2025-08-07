import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext); // Access token

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-sm p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h5 className="mb-4">Navigation</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button className="btn btn-link text-start w-100" onClick={() => navigate('/dashboard')}>Dashboard</button>
        </li>
        <li className="nav-item mb-2">
          <button className="btn btn-link text-start w-100" onClick={() => navigate('/my-job-applications')}>My Job Applications</button>
        </li>
        <li className="nav-item mb-2">
          <button className="btn btn-link text-start w-100" onClick={() => navigate('/resume-builder')}>Resume Builder</button>
        </li>

        <li className="nav-item mt-3">
          {token ? (
            <button className="btn btn-link text-start w-100 text-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="btn btn-link text-start w-100 text-primary" onClick={handleLogin}>
              Login
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
