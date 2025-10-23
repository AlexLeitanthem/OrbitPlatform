// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const user = JSON.parse(localStorage.getItem('user'));

  // If a user is logged in, show the page. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;