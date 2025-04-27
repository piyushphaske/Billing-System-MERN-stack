import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cashiers() {
  const [cashiers, setCashiers] = useState([]);
  const [newCashier, setNewCashier] = useState({ name: '', experience: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', experience: '', email: '', phone: '' });

  useEffect(() => {
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cashiers');
      setCashiers(response.data);
    } catch (error) {
      console.error('Error fetching cashiers:', error);
      alert('Error loading cashiers. Please try again.');
    }
  };

  const handleNewCashierChange = (e) => {
    const { name, value } = e.target;
    setNewCashier({ ...newCashier, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'name':
        if (/\d/.test(value)) {
          errorMessage = 'Name should not contain numbers';
        }
        break;
      case 'experience':
        if (parseInt(value) === 0) {
          errorMessage = 'Experience should not be 0';
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

  const checkDuplicatePhone = (phone, currentCashierId = null) => {
    return cashiers.some(cashier => 
      cashier.phone === phone && cashier._id !== currentCashierId
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      validateField(e.target.name, e.target.value);
    }
  };

  const addCashier = async () => {
    // First check all validation errors
    if (Object.values(errors).some(error => error !== '')) {
      alert('Please correct the errors before submitting');
      return;
    }

    // Check for duplicate phone number
    if (checkDuplicatePhone(newCashier.phone)) {
      alert('This phone number is already registered with another cashier');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cashiers', newCashier);
      setNewCashier({ name: '', experience: '', email: '', phone: '' });
      setErrors({ name: '', experience: '', email: '', phone: '' });
      fetchCashiers();
      alert('Cashier added successfully!');
    } catch (error) {
      console.error('Error adding cashier:', error);
      alert('Error adding cashier. Please try again.');
    }
  };

  const editCashier = async (cashier) => {
    // Check for duplicate phone number, excluding the current cashier
    if (checkDuplicatePhone(cashier.phone, cashier._id)) {
      alert('This phone number is already registered with another cashier');
      fetchCashiers(); // Refresh to revert changes
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/cashiers/${cashier._id}`, cashier);
      fetchCashiers();
      alert('Cashier updated successfully!');
    } catch (error) {
      console.error('Error editing cashier:', error);
      alert('Error updating cashier. Please try again.');
      fetchCashiers(); // Refresh to revert changes
    }
  };

  const deleteCashier = async (cashierId) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cashiers/${cashierId}`);
        fetchCashiers();
        alert('Cashier deleted successfully!');
      } catch (error) {
        console.error('Error deleting cashier:', error);
        alert('Error deleting cashier. Please try again.');
      }
    }
  };

  return (
    <div className="cashiers-container p-6">
      <h2 className="text-2xl font-bold mb-6">Cashiers</h2>
      
      <div className="new-cashier grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newCashier.name}
            onChange={handleNewCashierChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div>
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={newCashier.experience}
            onChange={handleNewCashierChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
          />
          {errors.experience && <div className="error-message">{errors.experience}</div>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newCashier.email}
            onChange={handleNewCashierChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={newCashier.phone}
            onChange={handleNewCashierChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        <button 
          onClick={addCashier}
          className="submit-btn"
        >
          Add Cashier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Experience</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashiers.map((cashier) => (
              <tr key={cashier._id} className="border-t">
                <td className="p-4">
                  <input
                    type="text"
                    value={cashier.name}
                    onChange={(e) => editCashier({ ...cashier, name: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={cashier.experience}
                    onChange={(e) => editCashier({ ...cashier, experience: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="email"
                    value={cashier.email}
                    onChange={(e) => editCashier({ ...cashier, email: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="tel"
                    value={cashier.phone}
                    onChange={(e) => editCashier({ ...cashier, phone: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => editCashier(cashier)}
                    className="edit-btn"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => deleteCashier(cashier._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .error-message {
          color: red;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
      `}</style>
    </div>
  );
}

export default Cashiers;