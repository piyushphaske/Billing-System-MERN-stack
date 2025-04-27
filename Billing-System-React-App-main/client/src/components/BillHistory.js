import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEye, FaTimes, FaTrash, FaSort } from 'react-icons/fa';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('invoice');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'date', 
    direction: 'desc' 
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bills/history');
      const validBills = response.data.filter(bill => 
        bill &&
        bill.invoiceNumber && 
        bill.total !== undefined &&
        bill.date &&
        bill.cashierInfo
      );
      setBills(validBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]);
    }
  };

  const deleteBill = (invoiceNumber) => {
    // Frontend-only delete functionality
    setBills(bills.filter(bill => bill.invoiceNumber !== invoiceNumber));
  };

  const sortBills = (bills) => {
    return [...bills].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'desc' 
          ? dateB - dateA 
          : dateA - dateB;
      }

      if (sortConfig.key === 'time') {
        const timeA = dateA.getHours() * 60 + dateA.getMinutes();
        const timeB = dateB.getHours() * 60 + dateB.getMinutes();

        return sortConfig.direction === 'desc' 
          ? timeB - timeA 
          : timeA - timeB;
      }

      return 0;
    });
  };

  const toggleSortDirection = (key) => {
    setSortConfig(prevConfig => ({
      key: key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const viewBillDetails = (bill) => {
    setSelectedBill(bill);
    setShowBillModal(true);
  };

  const filterBills = () => {
    let filteredBills = bills.filter(bill => {
      const searchTermLower = searchTerm.toLowerCase();
      
      switch (filterType) {
        case 'invoice':
          return bill.invoiceNumber?.toString().toLowerCase().includes(searchTermLower);
        
        case 'month':
          try {
            const date = new Date(bill.date);
            if (isNaN(date.getTime())) return false;
            const billMonth = date.toLocaleString('default', { month: 'long' });
            return billMonth.toLowerCase().includes(searchTermLower);
          } catch {
            return false;
          }
        
        case 'year':
          try {
            const date = new Date(bill.date);
            if (isNaN(date.getTime())) return false;
            const billYear = date.getFullYear().toString();
            return billYear.includes(searchTerm);
          } catch {
            return false;
          }
        
        default:
          return false;
      }
    });

    return sortBills(filteredBills);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const renderBillDetailsModal = () => {
    if (!showBillModal || !selectedBill) return null;
  
    return (
      <div className="bill-details-modal-overlay" onClick={() => setShowBillModal(false)}>
        <div className="bill-details-modal" onClick={(e) => e.stopPropagation()}>
          <button className="bill-details-modal-close" onClick={() => setShowBillModal(false)}>
            <FaTimes />
          </button>
  
          <h2 className="text-2xl font-bold mb-4">Bill Details</h2>
  
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Invoice Number:</strong> {selectedBill.invoiceNumber || 'N/A'}</p>
              <p><strong>Date:</strong> {formatDate(selectedBill.date)}</p>
              <p><strong>Time:</strong> {formatTime(selectedBill.date)}</p>
            </div>
            <div>
              <p><strong>Cashier:</strong> {selectedBill.cashierInfo || 'Unknown'}</p>
              <p><strong>Customer:</strong> {selectedBill.customerInfo || 'Walk-in'}</p>
            </div>
          </div>
  
          {selectedBill.items && selectedBill.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="bill-details-table">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="bill-details-table th">Item</th>
                    <th className="bill-details-table th">Quantity</th>
                    <th className="bill-details-table th">Price</th>
                    <th className="bill-details-table th">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="bill-details-table td">{item.name || 'Unnamed Item'}</td>
                      <td className="bill-details-table td">{item.quantity || 0}</td>
                      <td className="bill-details-table td">₹{(item.price || 0).toFixed(2)}</td>
                      <td className="bill-details-table td">₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="border border-black px-4 py-2 text-right font-bold">Total</td>
                    <td className="border border-black px-4 py-2 text-right font-bold">₹{(selectedBill.total || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No items found for this bill
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bill-history">
      <h2 className="text-2xl font-bold mb-6">Bill History</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="flex items-center flex-1 max-w-md">
          <FaSearch className="text-gray-400 -mr-8 z-10" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="invoice">Search by Invoice</option>
          <option value="month">Search by Month (name)</option>
          <option value="year">Search by Year</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Invoice No.</th>
              <th className="border px-4 py-2">Cashier</th>
              <th className="border px-4 py-2">Net Amount</th>
              <th className="border px-4 py-2">
                <div className="flex items-center">
                  Date 
                  <button 
                    onClick={() => toggleSortDirection('date')}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    <FaSort />
                  </button>
                </div>
              </th>
              <th className="border px-4 py-2">
                <div className="flex items-center">
                  Time 
                  <button 
                    onClick={() => toggleSortDirection('time')}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    <FaSort />
                  </button>
                </div>
              </th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterBills().map((bill) => (
              <tr key={bill.invoiceNumber} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{bill.invoiceNumber}</td>
                <td className="border px-4 py-2">{bill.cashierInfo}</td>
                <td className="border px-4 py-2">₹{bill.total?.toFixed(2) ?? '0.00'}</td>
                <td className="border px-4 py-2">{formatDate(bill.date)}</td>
                <td className="border px-4 py-2">{formatTime(bill.date)}</td>
                <td className="border px-4 py-2 text-center flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => viewBillDetails(bill)}
                    className="edit-btn p-2 rounded flex items-center justify-center"
                  >
                    <FaEye className="mr-2" /> View Bill
                  </button>
                  <button 
                    onClick={() => deleteBill(bill.invoiceNumber)}
                    className="delete-btn p-2 rounded flex items-center justify-center text-red-500 hover:bg-red-100"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderBillDetailsModal()}
    </div>
  );
};

export default BillHistory;