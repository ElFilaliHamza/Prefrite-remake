import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import React from "react";
import config from "../config/config";
import { AdminDataProvider } from "../components/contexts/adminContext";
import AdminDashboard from "../views/admin/adminDashboard";

const AdminRoutes = () => {
  return (
    <AdminDataProvider>
      <Header
        title={config.ROLE_NAME_TEXT.ADMIN}
        logout_route={config.BASE_ROUTE.ADMIN}
      />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AdminDataProvider>
  );
};

export default AdminRoutes;
