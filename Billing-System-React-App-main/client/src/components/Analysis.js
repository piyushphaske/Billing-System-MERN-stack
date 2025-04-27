import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Modified monthly data with year-specific variations
const ALL_MONTHLY_DATA = {
  2020: [
    { month: 'January', revenue: 3100 },
    { month: 'February', revenue: 5300 },
    { month: 'March', revenue: 4000 },
    { month: 'April', revenue: 6800 },
    { month: 'May', revenue: 4200 },
    { month: 'June', revenue: 4600 },
    { month: 'July', revenue: 4900 },
    { month: 'August', revenue: 5100 },
    { month: 'September', revenue: 4800 },
    { month: 'October', revenue: 5000 },
    { month: 'November', revenue: 5200 },
    { month: 'December', revenue: 5400 }
  ],
  2021: [
    { month: 'January', revenue: 4000 },
    { month: 'February', revenue: 5200 },
    { month: 'March', revenue: 5400 },
    { month: 'April', revenue: 4100 },
    { month: 'May', revenue: 5300 },
    { month: 'June', revenue: 5600 },
    { month: 'July', revenue: 5900 },
    { month: 'August', revenue: 6100 },
    { month: 'September', revenue: 5800 },
    { month: 'October', revenue: 6000 },
    { month: 'November', revenue: 6200 },
    { month: 'December', revenue: 6500 }
  ],
  2022: [
    { month: 'January', revenue: 5800 },
    { month: 'February', revenue: 6000 },
    { month: 'March', revenue: 6200 },
    { month: 'April', revenue: 6400 },
    { month: 'May', revenue: 6600 },
    { month: 'June', revenue: 6800 },
    { month: 'July', revenue: 7000 },
    { month: 'August', revenue: 4200 },
    { month: 'September', revenue: 5400 },
    { month: 'October', revenue: 7600 },
    { month: 'November', revenue: 7800 },
    { month: 'December', revenue: 8000 }
  ],
  2023: [
    { month: 'January', revenue: 6500 },
    { month: 'February', revenue: 6800 },
    { month: 'March', revenue: 7100 },
    { month: 'April', revenue: 7400 },
    { month: 'May', revenue: 5700 },
    { month: 'June', revenue: 8000 },
    { month: 'July', revenue: 6300 },
    { month: 'August', revenue: 8600 },
    { month: 'September', revenue: 8900 },
    { month: 'October', revenue: 7200 },
    { month: 'November', revenue: 9500 },
    { month: 'December', revenue: 9800 }
  ],
  2024: [
    { month: 'January', revenue: 7200 },
    { month: 'February', revenue: 7500 },
    { month: 'March', revenue: 7800 },
    { month: 'April', revenue: 4100 },
    { month: 'May', revenue: 5400 },
    { month: 'June', revenue: 8700 },
    { month: 'July', revenue: 9000 },
    { month: 'August', revenue: 8300 },
    { month: 'September', revenue: 9600 },
    { month: 'October', revenue: 9900 }
  ]
};

const SAMPLE_YEARLY_DATA = [
  { year: 2020, revenue: 58000 },
  { year: 2021, revenue: 65000 },
  { year: 2022, revenue: 72000 },
  { year: 2023, revenue: 79000 },
  { year: 2024, revenue: 72300 }
];

const SAMPLE_CASHIER_DATA = [
  { cashierName: 'John', totalBills: 450 },
  { cashierName: 'Sarah', totalBills: 380 },
  { cashierName: 'Mike', totalBills: 320 },
  { cashierName: 'Emma', totalBills: 290 },
  { cashierName: 'David', totalBills: 260 }
];

const Analysis = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [cashierStats, setCashierStats] = useState(SAMPLE_CASHIER_DATA);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const filterDataByYear = () => {
      setLoading(true);
      try {
        const yearData = ALL_MONTHLY_DATA[selectedYear] || [];
        setMonthlyRevenue(yearData);
        setCashierStats(SAMPLE_CASHIER_DATA);
      } catch (error) {
        setError('Error processing data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    filterDataByYear();
  }, [selectedYear]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Revenue Analysis</h1>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-4 py-2 bg-white shadow-sm"
          >
            {SAMPLE_YEARLY_DATA.map(item => (
              <option key={item.year} value={item.year}>
                {item.year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Revenue Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Monthly Revenue - {selectedYear}</h2>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cashier Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Cashier Bill Distribution</h2>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={cashierStats}
                    dataKey="totalBills"
                    nameKey="cashierName"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {cashierStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Trend Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Yearly Revenue Trend</h2>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <LineChart data={SAMPLE_YEARLY_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;