import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import React from "react";
import config from "../config/config";
import { AdminDataProvider } from "../components/contexts/adminContext";
import AdminDashboard from "../views/admin/adminDashboard";
import SellersList from "../views/admin/SellersList";
import SellerDetails from "../views/admin/SellerDetails";
import AddClient from "../views/admin/AddClient";
import DebitStatus from "../views/admin/DebitStatus";
import ClientDebitStatus from "../views/admin/ClientDebitStatus";
import InvoiceDebitStatus from "../views/admin/InvoiceDebitStatus";
import PageNotFound from "../views/PageNotFound";

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
        <Route path="/vendeurs" element={<SellersList />} />
        <Route path="/vendeur/:idSeller" element={<SellerDetails />} />
        <Route path="/addClient/:idSeller" element={<AddClient />} />
        <Route path="/debitStatus" element={<DebitStatus route={config.BASE_ROUTE.ADMIN}/>} />
        <Route path="/debitStatus/:idSeller" element={<ClientDebitStatus route={config.BASE_ROUTE.ADMIN}/>} />
        {/* <Route
          path="/invoiceDebitStatus/:idClient"
          element={<InvoiceDebitStatus route={config.BASE_ROUTE.ADMIN}/>}
        /> */}
      
        <Route path="*" element={<PageNotFound />} />
      \</Routes>
    </AdminDataProvider>
  );
};

export default AdminRoutes;
