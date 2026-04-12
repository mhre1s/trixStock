import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem("@TrixStock:user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user || !user.level) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.level)) {
    // Redirect to a suitable page
    if (user.level === 'operacional') return <Navigate to="/operational" replace />;
    if (user.level === 'almoxarifado') return <Navigate to="/itemregister" replace />;
    return <Navigate to="/operational" replace />;
  }

  return children;
};

export default ProtectedRoute;
