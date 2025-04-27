// client/src/components/BillInvoice.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUtensils, FaLeaf, FaBreadSlice, FaIceCream, FaCoffee, FaChevronDown, FaChevronUp, FaSearch, FaFilter, FaPlus, FaMinus,FaTimes } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';


const categoryIcons = {
  Starters: <FaUtensils />,       
  "Main Course": <FaUtensils />,  
  Salads: <FaLeaf />,
  Breads: <FaBreadSlice />,
  Desserts: <FaIceCream />,
  Beverages: <FaCoffee />
};

const menuData = [
  {
    category: "Starters",
    icon: <FaUtensils />,
    subcategories: [
      {
        name: "Vegetarian Starters",
        items: [
          { name: "Veg Spring Rolls", price: 120 , image: "/images/Veg Spring Rolls/Veg_Spring_Rolls.jpg"},
          { name: "Paneer Tikka", price: 150 , image: "/images/Paneer Tikka/Paneer_Tikka.jpg"},
          { name: "Stuffed Mushrooms", price: 130 , image: "/images/Stuffed Mushrooms/Stuffed_Mushroom.jpg"}
        ]
      }
    ]
  }
];

const BillInvoice = () => {
  const [menu, setMenu] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cashiers, setCashiers] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [items, setItems] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isHomeUpdated, setIsHomeUpdated] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: ''
  });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    subcategory: '',
    name: '',
    price: '',
    image: 'https://via.placeholder.com/50'
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    fetchCustomers();
    fetchCashiers();
    fetchMenu();
    fetchRestaurantInfo();
    generateInvoiceDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUp(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchRestaurantInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant-info');
      setRestaurantInfo(response.data);
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
    }
  };

  const generateInvoiceDetails = () => {
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    updateDateTime();
  };

  const updateDateTime = () => {
    const now = new Date();
    setDate(now.toLocaleDateString());
    setTime(now.toLocaleTimeString());
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu');
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Fallback to menuData if API fails
      setMenu(menuData);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCashiers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cashiers');
      setCashiers(response.data);
    } catch (error) {
      console.error('Error fetching cashiers:', error);
    }
  };

  const handleCustomerChange = (e) => setSelectedCustomer(e.target.value);
  const handleCashierChange = (e) => setSelectedCashier(e.target.value);

  const addItemToBill = (item) => {
    const existingItem = items.find(i => i.name === item.name);
    if (existingItem) {
      setItems(items.map(i => 
        i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };

  const removeItemFromBill = (item) => {
    const existingItem = items.find(i => i.name === item.name);
    if (existingItem.quantity > 1) {
      setItems(items.map(i => 
        i.name === item.name ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setItems(items.filter(i => i.name !== item.name));
    }
  };

  const calculateTotal = () => items.reduce((total, item) => total + item.quantity * item.price, 0);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
  });

  const toggleCategory = (category) => {
    setOpenCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const closeAllCategories = () => {
    setOpenCategories({});
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFilter = (e) => setFilterOption(e.target.value);

  const handleAddNewItem = async () => {
    try {
      await axios.post('http://localhost:5000/api/menu/add', newItem);
      await fetchMenu();
      setShowAddItemModal(false);
      setNewItem({
        category: '',
        subcategory: '',
        name: '',
        price: '',
        image: 'https://via.placeholder.com/50'
      });
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleDeleteMenuItem = async (itemName) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/delete/${itemName}`);
        await fetchMenu();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const filteredAndSortedItems = menu
    .flatMap(category => 
      category.subcategories 
        ? category.subcategories.flatMap(subcategory => subcategory.items)
        : category.items
    )
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filterOption === 'lowToHigh') return a.price - b.price;
      if (filterOption === 'highToLow') return b.price - a.price;
      return 0;
    });

    const renderMenuItem = (item) => (
      <div 
        key={item.name} 
        className="menu-item"
        onClick={() => addItemToBill(item)}
        style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickability
      >
        <img src={item.image} alt={item.name} className="menu-item-image" />
        <div className="menu-item-info">
          <span className="menu-item-name">{item.name}</span>
          <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
        </div>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent item from being added when delete is clicked
            handleDeleteMenuItem(item.name);
          }}
        >
          Delete
        </button>
      </div>
    );

  
    const PrintableBill = React.forwardRef((props, ref) => (
      <div ref={ref} className="printable-bill">
        <h1 style={{ textAlign: 'center' }}>{restaurantInfo.name}</h1>
        <p style={{ textAlign: 'center' }}>{restaurantInfo.address}</p>
        <p style={{ textAlign: 'center' }}>
          {restaurantInfo.city}, {restaurantInfo.state} - {restaurantInfo.pincode}
        </p>
        <p style={{ textAlign: 'center' }}>Phone: {restaurantInfo.phone}</p>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
          </div>
          <div>
            <p><strong>Customer:</strong> {selectedCustomer === "walk-in" ? "Walk-in" : customers.find(c => c._id === selectedCustomer)?.name}</p>
            <p><strong>Cashier:</strong> {selectedCashier ? cashiers.find(c => c._id === selectedCashier)?.name : ''}</p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>Item</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Quantity</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Price</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{item.name}</td>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}><strong>Total:</strong></td>
              <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}><strong>₹{calculateTotal().toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>Thank you for your visit!</p>
      </div>
    ));
  
  const handleUpdateConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    updateDateTime();
    const total = calculateTotal();
    try {
      // Create the bill data object with all necessary fields
      const billData = { 
        total,
        date,
        time,
        items,
        invoiceNumber, // Add invoice number
        customerInfo: selectedCustomer === "walk-in" ? "Walk-in" : customers.find(c => c._id === selectedCustomer)?.name,
        cashierInfo: cashiers.find(c => c._id === selectedCashier)?.name
      };
  
      // First, create the bill
      await axios.post('http://localhost:5000/api/bills', billData);
      
      // Then update the earnings
      await axios.post('http://localhost:5000/api/bills/update', billData);
      
      setIsHomeUpdated(true);
      setShowConfirmModal(false);
      alert('Bill created and earnings updated successfully!');
      
      // // Clear the bill after successful creation
      // setItems([]);
      // setSelectedCustomer('');
      // setSelectedCashier('');
      // generateInvoiceDetails(); // Generate new invoice number for next bill
      
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill. Please try again.');
    }
  };

  return (
    <div className="bill-invoice-container">
     {showScrollUp && (
        <div className="scroll-up-container">
        <button className="scroll-up-btn" onClick={scrollToTop}>
          <FaChevronUp />
        </button>
      </div>
      )}
      
      {Object.values(openCategories).some(Boolean) && (
        <button className="close-menu-btn" onClick={closeAllCategories}>
          <FaTimes />
        </button>
      )}
      <div className="menu-column">
        <div className="menu-header">
          <h3>Menu</h3>
          <button 
            className="add-item-btn"
            onClick={() => setShowAddItemModal(true)}
          >
            Add New Item
          </button>
        </div>
        <div className="search-filter-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select value={filterOption} onChange={handleFilter} className="filter-select">
              <option value="">Filter</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        {searchTerm || filterOption
          ? filteredAndSortedItems.map(renderMenuItem)
          : menu.map(category => (
              <div key={category.category} className="menu-category">
                <h3 className="menu-category-title" onClick={() => toggleCategory(category.category)}>
                <span className="icon">
                  {categoryIcons[category.category] || <FaUtensils />} {/* Default to FaUtensils */}
                </span>
                {category.category}
                <span className="dropdown-icon">
                  {openCategories[category.category] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
                </h3>
                {openCategories[category.category] && (
                  <div>
                    {category.subcategories
                      ? category.subcategories.map(subcategory => (
                          <div key={subcategory.name} className="menu-subcategory">
                            <h4 className="menu-subcategory-title">{subcategory.name}</h4>
                            {subcategory.items.map(renderMenuItem)}
                          </div>
                        ))
                      : category.items.map(renderMenuItem)}
                  </div>
                )}
              </div>
            ))}
      </div>
      <div className="bill-column">
        <div className="bill-preview">
          <h2>Invoice Preview</h2>
          <select value={selectedCustomer} onChange={handleCustomerChange}>
            <option value="">Select Customer</option>
            <option value="walk-in">Walk-in</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>{customer.name}</option>
            ))}
          </select>
          <select value={selectedCashier} onChange={handleCashierChange}>
            <option value="">Select Cashier</option>
            {cashiers.map(cashier => (
              <option key={cashier._id} value={cashier._id}>{cashier.name}</option>
            ))}
          </select>
          <div className="selected-items">
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.name}</span>
                <div className="quantity-control">
                <FaMinus className="quantity-btn" onClick={() => removeItemFromBill(item)} />
                  <span>{item.quantity}</span>
                  <FaPlus className="quantity-btn" onClick={() => addItemToBill(item)} />
                </div>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="total">Total: ₹{calculateTotal().toFixed(2)}</div>
          <div className="action-buttons">
            <button 
              onClick={handleUpdateConfirmation} 
              className="submit-btn"
              disabled={items.length === 0 || !selectedCashier || !selectedCustomer}
            >
              Update to Home
            </button>
            <button 
              onClick={handlePrint} 
              className="print-btn"
              disabled={!isHomeUpdated || items.length === 0 || !selectedCashier || !selectedCustomer}
            >
              Download PDF
            </button>
          </div>
        </div>
        <PrintableBill ref={componentRef} />
      </div>

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Menu Item</h3>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              className="modal-input"
            >
              <option value="">Select Category</option>
              {menu.map(category => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>

            {newItem.category && menu.find(cat => cat.category === newItem.category)?.subcategories && (
              <select
                value={newItem.subcategory}
                onChange={(e) => setNewItem(prev => ({ ...prev, subcategory: e.target.value }))}
                className="modal-input"
              >
                <option value="">Select Subcategory</option>
                {menu
                  .find(cat => cat.category === newItem.category)
                  ?.subcategories.map(sub => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="modal-input"
            />

            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              className="modal-input"
            />

            <div className="modal-buttons">
              <button 
                onClick={handleAddNewItem}
                disabled={!newItem.name || !newItem.price || !newItem.category}
                className="modal-submit"
              >
                Add Item
              </button>
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <h3>Confirm Order</h3>
            <p>Are you sure this is the final order?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmUpdate} className="modal-submit">Yes</button>
              <button onClick={() => setShowConfirmModal(false)} className="modal-cancel">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillInvoice;
