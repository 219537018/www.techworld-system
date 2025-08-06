// components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // styling to be added next

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('aToken');
    navigate('/login');
  };

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? '←' : '→'}
      </button>

      {isOpen && (
        <div className="dashboard-sidebar">
          <h5>Navigation</h5>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className="btn btn-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link" onClick={() => navigate('/publish')}>Publish Jobs</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link" onClick={() => navigate('/applicants')}>Applicants</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link text-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
