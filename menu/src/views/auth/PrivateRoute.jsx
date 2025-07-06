import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  const location  = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
