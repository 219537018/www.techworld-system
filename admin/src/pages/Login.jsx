import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Initialize navigate function
  
  const backendUrl = 'http://localhost:4000';

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
      
      if (data.success) {
        localStorage.setItem('aToken', data.token);
        // Redirect to the dashboard after successful login
        navigate('/dashboard'); // Assuming the dashboard route is '/dashboard'
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>Admin Login</h2>

        <div>
          <label>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
