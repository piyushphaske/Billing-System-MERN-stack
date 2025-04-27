// client/src/components/UserTypeSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../auth.css';  // Import the auth styles

const UserTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="text-2xl font-bold mb-4">
          <img src="/Logo-icon.png" alt="Logo" className="logo" /> ChillBill
        </h1>
        <h2>Welcome to ChillBill</h2>
        <p>Select User Type</p>
        <div className="auth-buttons">
          <button 
            className="auth-button admin"
            onClick={() => navigate('/auth/admin')}
          >
            Admin Login
          </button>
          <button 
            className="auth-button cashier"
            onClick={() => navigate('/auth/cashier')}
          >
            Cashier Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;  // Add this export