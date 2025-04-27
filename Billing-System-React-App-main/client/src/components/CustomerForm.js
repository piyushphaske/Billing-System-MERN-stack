import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerForm({ onCustomerAdded, selectedCustomer, onUpdateComplete }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone
      });
      setIsEditing(true);
    } else {
      setFormData({ name: '', email: '', phone: '' });
      setIsEditing(false);
    }
  }, [selectedCustomer]);

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'name':
        if (/\d/.test(value)) {
          errorMessage = 'Name should not contain numbers';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Invalid email format';
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          errorMessage = 'Phone number should be 10 digits';
        } else if (value === '0000000000') {
          errorMessage = 'Invalid phone number';
        } else if (value.startsWith('0')) {
          errorMessage = 'Phone number should not start with 0';
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };

  const checkDuplicatePhone = async (phone) => {
    try {
      // Skip duplicate check if editing and phone hasn't changed
      if (isEditing && selectedCustomer.phone === phone) {
        return false;
      }
      const response = await axios.get(`http://localhost:5000/api/customers/check-phone/${phone}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      validateField(e.target.name, e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error !== '')) {
      alert('Please correct the errors before submitting');
      return;
    }

    try {
      const isDuplicate = await checkDuplicatePhone(formData.phone);
      if (isDuplicate) {
        alert('This phone number is already registered with another customer');
        return;
      }

      if (isEditing && selectedCustomer._id) {
        // Update existing customer
        await axios.put(`http://localhost:5000/api/customers/${selectedCustomer._id}`, formData);
        onUpdateComplete();
      } else {
        // Add new customer
        await axios.post('http://localhost:5000/api/customers', formData);
        onCustomerAdded();
      }

      setFormData({ name: '', email: '', phone: '' });
      setErrors({ name: '', email: '', phone: '' });
      setIsEditing(false);
    } catch (error) {
      if (error.response?.data?.error === 'Phone number already exists') {
        alert('This phone number is already registered with another customer');
      } else {
        alert('Error saving customer. Please try again.');
        console.error('Error saving customer:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '' });
    setErrors({ name: '', email: '', phone: '' });
    setIsEditing(false);
    if (onUpdateComplete) onUpdateComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Name"
          required
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Email"
          required
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Phone"
          required
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>
      <div className="button-group">
        <button type="submit" className="submit-btn">
          {isEditing ? 'Update Customer' : 'Add Customer'}
        </button>
        {isEditing && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
      <style jsx>{`
        .error-message {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .cancel-btn {
          background-color: #gray;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
      `}</style>
    </form>
  );
}

export default CustomerForm;