import React from "react";
import { Route, Routes } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";
import Header from "./Header";

const SellerRoutes = () => {
  return (
    <div>
      <Header title="Seller" logoutRoute="seller" />
      <Routes>
        <Route path="/" element={<SellerDashboard />} />
      </Routes>
    </div>
  );
};

export default SellerRoutes;
