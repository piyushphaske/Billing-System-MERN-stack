import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaComments } from 'react-icons/fa';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [feedbackData, setFeedbackData] = useState({
    type: 'suggestion',
    message: '',
  });

  const [notification, setNotification] = useState({ type: '', message: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match!' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await axios.post('http://localhost:5000/api/auth/change-password', 
        {
          userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setNotification({ type: 'success', message: response.data.message });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error changing password'
      });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      const response = await axios.post('http://localhost:5000/api/feedback', 
        {
          userId,
          ...feedbackData
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      setNotification({ type: 'success', message: response.data.message });
      setFeedbackData({ type: 'suggestion', message: '' });
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error submitting feedback'
      });
    }
  };

  return (
    <div className="settings">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {notification.message && (
        <div className={`p-4 mb-6 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaLock className="text-gray-600" />
            <h3 className="text-xl font-semibold">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
                className="border rounded-lg px-4 py-2 w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
                className="border rounded-lg px-4 py-2 w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })}
                className="border rounded-lg px-4 py-2 w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="edit-btn"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Feedback Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaComments className="text-gray-600" />
            <h3 className="text-xl font-semibold">Send Feedback</h3>
          </div>

          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Feedback Type
              </label>
              <select
                value={feedbackData.type}
                onChange={(e) => setFeedbackData({
                  ...feedbackData,
                  type: e.target.value
                })}
                className="border rounded-lg px-4 py-2 w-full"
              >
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Your Message
              </label>
              <textarea
                value={feedbackData.message}
                onChange={(e) => setFeedbackData({
                  ...feedbackData,
                  message: e.target.value
                })}
                className="border rounded-lg px-4 py-2 w-full h-32 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="edit-btn"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;