import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "../views/SuperAdmin/SuperAdminDashboard";
import Categories from "../views/SuperAdmin/Categories";
import AddCategory from "../views/SuperAdmin/AddCategory";
import CategoryDetail from "../views/SuperAdmin/CategoryDetail";
import Alerts from "../views/SuperAdmin/Alerts";
import ArticleDetail from "../views/SuperAdmin/ArticleDetail";
import AddArticle from "../views/SuperAdmin/AddArticle";
import DebitStatus from "../views/SuperAdmin/DebitStatus";
import DebitStatusDetail from "../views/SuperAdmin/DebitStatusDetail";
import AccountManagement from "../views/SuperAdmin/AccountManagement";
import PaymentHistory from "../views/SuperAdmin/PaymentHistory";
import StockStatus from "../views/SuperAdmin/StockStatus";
import LiveSellers from "../views/SuperAdmin/LiveSellers";
import OffClients from "../views/SuperAdmin/InactiveClients";
import Stats from "../views/SuperAdmin/Stats";
import ClientDebitStatus from "../views/SuperAdmin/ClientDebitStatus";
import InvoiceDebitStatus from "../views/SuperAdmin/InvoiceDebitStatus";
import InvoiceDetail from "../views/SuperAdmin/InvoiceDetail";
import SellerStats from "../views/SuperAdmin/SellerStats";
import Accounts from "../views/SuperAdmin/Accounts";
import CreateAccount from "../views/SuperAdmin/CreateAccount";
import InactiveClients from "../views/SuperAdmin/InactiveClients";
import Status from "../views/SuperAdmin/Status";
import EtatDeStock from "../views/SuperAdmin/EtatDeStock";
import Header from "../components/Header";
import { SuperDataProvider } from "../components/contexts/SuperContext";

const SuperAdminRoutes = () => {
  
  return (
    <SuperDataProvider>
      <Header title="Super Admin" logout_route="superadmin" />
      <Routes>
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/create" element={<CreateAccount />} />
        <Route path="/addCategory" element={<AddCategory />} />
        <Route path="/category/:catId" element={<CategoryDetail />} />
        <Route path="/inactiveClients" element={<InactiveClients />} />
        <Route path="/status" element={<Status />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/article/:idArt" element={<ArticleDetail />} />
        <Route path="/addArticle/:catId" element={<AddArticle />} />
        <Route path="/debitStatus" element={<DebitStatus />} />
        <Route path="/stockStatus" element={<EtatDeStock />} />
        <Route path="/debitStatus/:idSeller" element={<ClientDebitStatus />} />
        <Route
          path="/invoiceDebitStatus/:idClient"
          element={<InvoiceDebitStatus />}
        />
        <Route
          path="/debitStatusInvoice/:idInvoice"
          element={<InvoiceDetail />}
        />
        <Route path="/accountManagement" element={<AccountManagement />} />
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/stockStatus" element={<StockStatus />} />
        <Route path="/liveSellers" element={<LiveSellers />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/stats/SellerStats/:idSeller" element={<SellerStats />} />
      </Routes>
    </SuperDataProvider>
  );
};

export default SuperAdminRoutes;
