import { Route, Routes } from "react-router-dom";
import SellerDashboard from "../views/Sellers/SellerDashboard";
import Header from "../components/Header";
import React from "react";
import { useSellerData } from "../components/contexts/SellerContext";
import config from "../config/config";
import InvoiceList from "../views/Sellers/InvoiceList";
import SellerInvoiceDetail from "../views/Sellers/SellerInvoiceDetail";
import StockMobile from "../components/StockMobile";
import Commandes from "../views/Sellers/Commandes";
import CommandDetail from "../views/Sellers/CommandDetail";
import AddCmdRoutes from "../components/AddCmdRoutes";
import SellRoutes from "./sellRoutes";

const SellerRoutes = () => {
  const sellerData = useSellerData();
  if (!sellerData) {
    return (
      <>
      <Header title={config.ROLE_NAME_TEXT.SELLER} logout_route={config.BASE_ROUTE.SELLER} />
        No seller data found!
      </>
    );
  }
  return (
    <>
      <Header title={sellerData.sellerInfo.name} logout_route={config.BASE_ROUTE.SELLER} />
      <Routes>
        <Route path="/" element={<SellerDashboard />} />
        <Route path="/state" element={<StockMobile />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/cmd" element={<Commandes />} />
        <Route path="/cmd/:idCmd" element={<CommandDetail />} />
        <Route path="/invoice/:idInvoice" element={<SellerInvoiceDetail />} />
        <Route path="/addCommand/*" element={<AddCmdRoutes />} />
        <Route path="/sell/*" element={<SellRoutes />} />
      </Routes>
    </>
  );
};

export default SellerRoutes;
