import React, { useState, useEffect } from 'react';
import { FaRupeeSign, FaFileInvoice, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({ totalEarnings: 0, totalBills: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bills/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    
    const day = parts.find(part => part.type === 'day').value;
    const suffix = getDaySuffix(parseInt(day));
    
    return parts.map(part => {
      if (part.type === 'day') {
        return day + suffix;
      }
      return part.value;
    }).join('');
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  // Navigation actions
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaUser className="icon" />
          <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{userType} Dashboard</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: '0', color: 'var(--primary-color)' }}>{formatDate(currentTime)}</h3>
          <h2 style={{ margin: '5px 0 0 0', color: 'var(--text-color)' }}>{formatTime(currentTime)}</h2>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaRupeeSign className="icon" /> Total Earnings
          </h2>
          <p style={{ fontSize: '1.5em', margin: '10px 0', color: 'var(--primary-color)' }}>
            ₹ {stats.totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="stat-item">
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaFileInvoice className="icon" /> Total Bills
          </h2>
          <p style={{ fontSize: '1.5em', margin: '10px 0', color: 'var(--primary-color)' }}>
            {stats.totalBills}
          </p>
        </div>
      </div>

      <div className="menu-container" style={{ marginTop: '30px' }}>
        <h2 className="menu-category-title">Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
          <button 
            className="menu-item"
            onClick={() => handleNavigation('/bill')}
          >
            Generate New Bill
          </button>
          <button 
            className="menu-item"
            onClick={() => handleNavigation('/analysis')}
          >
            View Reports
          </button>
          <button 
            className="menu-item"
            onClick={() => handleNavigation('/bill-history')}
          >
            View Bill History
          </button>
          <button 
            className="menu-item"
            onClick={() => handleNavigation('/settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;