import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { setToken } = useContext(AppContext);
  const backendUrl = 'http://localhost:4000'; // Update if needed

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          return;
        }

        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          confirmPassword,
        });

        if (data.success) {
          toast.success('Account created successfully. Please log in.');
          setState('Login');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-background">
      <form onSubmit={onSubmitHandler} className="w-100 w-sm-75 w-md-50 w-lg-40 p-4 border shadow rounded">
        <h2 className="text-center mb-4">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className="text-center mb-4">Please {state === 'Sign Up' ? 'sign up' : 'log in'} to proceed</p>

        {state === 'Sign Up' && (
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              type="text"
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="form-control"
            type="email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="form-control"
            type="password"
            required
          />
        </div>

        {state === 'Sign Up' && (
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="form-control"
              type="password"
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100 mb-3">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className="text-center">
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setState('Login')} className="btn btn-link p-0">
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setState('Sign Up')} className="btn btn-link p-0">
                Sign Up here
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;