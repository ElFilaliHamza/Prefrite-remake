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
import Encaissements from "../views/admin/Encaissements";
import Clients from "../views/admin/Clients";
import ClientDetail from "../views/admin/ClientDetail";
import CommandDetail from "../views/admin/CommandDetail";
import CommandsHistory from "../views/admin/CommandsHistory";
import CommandsAdmin from "../views/admin/CommandsAdmin";

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
        <Route path="/addClient/" element={<AddClient />} />
        <Route path="/debitStatus" element={<DebitStatus route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/pay" element={<Encaissements route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/clients" element={<Clients route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/client/:clientId" element={<ClientDetail route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/debitStatus/:idSeller" element={<ClientDebitStatus route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/commands" element={<CommandsAdmin route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/command/:commandId" element={<CommandDetail route={config.BASE_ROUTE.ADMIN} />} />
        <Route path="/commandHistory" element={<CommandsHistory route={config.BASE_ROUTE.ADMIN} />} />
        {/* <Route
          path="/invoiceDebitStatus/:idClient"
          element={<InvoiceDebitStatus route={config.BASE_ROUTE.ADMIN}/>}
        /> */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AdminDataProvider>
  );
};

export default AdminRoutes;
