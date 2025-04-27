import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaUserTie, FaFileInvoice, FaHistory, FaChartLine, FaStore ,FaSignOutAlt } from 'react-icons/fa';

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div className="modal-buttons">
          <button 
            className="modal-cancel"
            onClick={onClose}
          >
            No, Cancel
          </button>
          <button 
            className="modal-submit"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setShowLogoutModal(false);
    navigate('/auth');
  };

  // Define navigation items with role-based access
  const navItems = [
    { path: '/', label: 'Home', allowedRoles: ['admin', 'cashier'], icon: <FaHome /> },
    { path: '/customers', label: 'Customers', allowedRoles: ['admin'], icon: <FaUsers /> },
    { path: '/cashiers', label: 'Cashiers', allowedRoles: ['admin'], icon: <FaUserTie /> },
    { path: '/bill', label: 'Create Bill', allowedRoles: ['admin', 'cashier'], icon: <FaFileInvoice /> },
    { path: '/bill-history', label: 'Bill History', allowedRoles: ['admin'], icon: <FaHistory /> },
    { path: '/analysis', label: 'Analysis', allowedRoles: ['admin'], icon: <FaChartLine /> },
    { path: '/restaurant-info', label: 'Restaurant Info', allowedRoles: ['admin', 'cashier'], icon: <FaStore /> }
  ];

  return (
    <>
      <nav className="navbar flex items-center justify-between p-4 bg-white shadow-md">
        <ul className="flex items-center gap-6">
          {navItems.map((item, index) => (
            item.allowedRoles.includes(userRole) && (
              <li key={index}>
                <Link to={item.path} className="flex items-center gap-2">
                  {item.icon && <span className="nav-icon">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            )
          ))}
        </ul>

        <button 
          className="logout-button"
          onClick={() => setShowLogoutModal(true)}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </nav>

      {showLogoutModal && (
        <LogoutModal 
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}

      <style jsx="true">{`
        .navbar {
          background-color: var(--primary-color);
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 2rem;
          padding: 15px 10px;
          box-shadow: 0 2px 10px var(--shadow-color);
        }

        .navbar ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .navbar li {
          margin: 0 20px;
        }

        .nav-icon {
          display: inline-flex;
          align-items: center;
          margin-right: 0.15rem;
        }

        .navbar a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          font-size: 1.1em;
        }
        
        .navbar a:hover {
          color: var(--secondary-color);
        }

        .logout-button {
          display: flex;
          align-items: center;
          background-color: #4CAF50;
          color: white;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .logout-button:hover {
          background-color: #f44336;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }

        .modal-submit,
        .modal-cancel {
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .modal-submit {
          background-color: #4CAF50;
          color: white;
        }

        .modal-submit:hover {
          background-color: #45a049;
        }

        .modal-cancel {
          background-color: #f44336;
          color: white;
        }

        .modal-cancel:hover {
          background-color: #da190b;
        }
      `}</style>
    </>
  );
}

export default Navbar;