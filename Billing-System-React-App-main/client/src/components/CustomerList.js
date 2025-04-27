import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerForm from './CustomerForm';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleUpdateComplete = () => {
    setSelectedCustomer(null);
    fetchCustomers();
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        console.log(`Attempting to delete customer with ID: ${customerId}`);
        await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-list">
      <h2>Customer List</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      
      <CustomerForm 
        onCustomerAdded={fetchCustomers}
        selectedCustomer={selectedCustomer}
        onUpdateComplete={handleUpdateComplete}
      />

      <div className="customer-header">
        <span>Name</span>
        <span>Email</span>
        <span>Phone</span>
        <span>Actions</span>
      </div>

      <ul>
        {filteredCustomers.map(customer => (
          <li key={customer._id} className="customer-item">
            <span>{customer.name}</span>
            <span>{customer.email}</span>
            <span>{customer.phone}</span>
            <div className="action-buttons">
              <button 
                className="edit-btn" 
                onClick={() => handleEdit(customer)}
              >
                Edit
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(customer._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .customer-list {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        

        .customer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-weight: bold;
        }

        .customer-header span {
          flex: 1;
          padding: 0 10px;
        }

        .customer-header span:last-child {
          flex: 0.5;
          text-align: center;
        }
        
        .customer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #fff;
        }
        
        .customer-item span {
          flex: 1;
          padding: 0 10px;
        }
      `}</style>
    </div>
  );
}

export default CustomerList;