import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userType } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        ...formData,
        role: userType
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>
      <div className="emoji"></div>

      <div className="auth-box">
        <h1 className="text-2xl font-bold mb-4">
          <img src="/Logo-icon.png" alt="Logo" className="logo" /> ChillBill
        </h1>
        <h2>{isLogin ? 'Sign In' : 'Register'}</h2>
        <p>to access {userType} account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="auth-submit">
            {isLogin ? 'Continue' : 'Register'}
          </button>
        </form>
        
        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            className="switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
