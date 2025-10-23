// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
}
export default AdminRoute;