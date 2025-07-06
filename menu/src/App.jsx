import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './views/auth/PrivateRoute';

import AuthLayout  from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout   from 'layouts/rtl';
import Landing     from 'landing/Landing';
import Home        from 'menu/Home';

const App = () => {
  const hostname = window.location.hostname;

  return (
    <Routes>
      {/* Public auth */}
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Protected admin */}
      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />

      {/* Protected RTL */}
      <Route
        path="rtl/*"
        element={
          <PrivateRoute>
            <RtlLayout />
          </PrivateRoute>
        }
      />

      {/* Public site */}
      <Route path="/" element={<Landing />} />
      <Route path="/restaurant/:restaurantId" element={<Home />} />
    </Routes>
  );
};

export default App;
