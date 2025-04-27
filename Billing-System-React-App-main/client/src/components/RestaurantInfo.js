//client/src/components/RestaurantInfo.js
// RestaurantInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const RestaurantInfo = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    phone: ''
  });

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant-info');
      setRestaurantInfo(response.data);
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
    }
  };

  const handleInputChange = (e) => {
    setRestaurantInfo({
      ...restaurantInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/restaurant-info', restaurantInfo);
      alert('Restaurant information updated successfully!');
    } catch (error) {
      console.error('Error updating restaurant info:', error);
      alert('Failed to update restaurant information.');
    }
  };

  return (
    <div className="restaurant-info-container">
      <h2>Restaurant Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Restaurant Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={restaurantInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Restaurant Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={restaurantInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pincode">Pincode:</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={restaurantInfo.pincode}
            onChange={handleInputChange}
            pattern="[0-9]{6}"
            maxLength="6"
            title="Please enter a valid 6-digit pincode"
            required
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={restaurantInfo.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <select
            id="state"
            name="state"
            value={restaurantInfo.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={restaurantInfo.phone}
            onChange={handleInputChange}
            pattern="[0-9]{10}"
            maxLength="10"
            title="Please enter a valid 10-digit phone number"
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default RestaurantInfo;