import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const [showPolicy, setShowPolicy] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const isLoggedIn = localStorage.getItem("token"); // Or use your auth logic here
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row g-4 py-5 border-top">
        <div className="col-md-6">
          <h5 className="text-primary">Tech World</h5>
          <p>
            Tech World is a modern software development hub focused on delivering high-quality solutions. From web apps to backend systems, we empower developers with scalable, reliable, and innovative stacks.
          </p>
        </div>
        <div className="col-md-3">
          <h6>Company</h6>
          <ul className="list-unstyled">
            <li
              className="text-decoration-none text-primary"
              role="button"
              onClick={handleHomeClick}
            >
              Home
            </li>
            <li className="text-primary" role="button" onClick={() => setShowPolicy(true)}>Privacy Policy</li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6>Quick Links</h6>
          <ul className="list-unstyled">
            <li>
              <a href="http://localhost:3001"target="_blank" className="text-decoration-none" rel="noreferrer">
                Admin Panel
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center pb-3 text-muted small">
        © 2025 Tech World. All Rights Reserved.
      </div>

      {showPolicy && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Privacy Policy</h5>
                <button type="button" className="btn-close" onClick={() => setShowPolicy(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  We collect only necessary information to improve our services and never share your data without consent.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowPolicy(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
