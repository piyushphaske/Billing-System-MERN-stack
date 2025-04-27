// client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userType');
  const location = useLocation();

  // Define routes that are restricted to admin only
  const adminOnlyRoutes = ['/customers', '/cashiers'];

  if (!token) {
    return <Navigate to="/auth" />;
  }

  // Check if cashier is trying to access admin-only routes
  if (userRole === 'cashier' && adminOnlyRoutes.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;