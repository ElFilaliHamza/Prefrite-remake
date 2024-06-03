import { Route, Routes } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";
import Header from "./Header";
import React from "react";
import SellRoutes from "./sellRoutes";
import { SellerDataProvider } from "./SellerDataContext";
import config from "../config/config";
import { useAppContext } from "./AppContext";

const SellerRoutes = () => {
  return (
    <SellerDataProvider>
      <Header
        logout_route={config.BASE_ROUTE.SELLER}
      />
      <Routes>
        <Route path="/" element={<SellerDashboard />} />
        <Route path="/sell/*" element={<SellRoutes />} />
      </Routes>
    </SellerDataProvider>
  );
};

export default SellerRoutes;
