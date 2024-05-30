import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SellerDashboard from './SellerDashboard';

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SellerDashboard />} />
    </Routes>
  );
};

export default SellerRoutes;
