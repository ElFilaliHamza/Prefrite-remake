import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "../views/SuperAdmin/SuperAdminDashboard";
import Categories from "../views/SuperAdmin/Categories";
import AddCategory from "../views/SuperAdmin/AddCategory";
import CategoryDetail from "../views/SuperAdmin/CategoryDetail";
import Alerts from "../views/SuperAdmin/Alerts";
import ArticleDetail from "../views/SuperAdmin/ArticleDetail";
import AddArticle from "../views/SuperAdmin/AddArticle";
import AccountManagement from "../views/SuperAdmin/AccountManagement";
import PaymentHistory from "../views/SuperAdmin/PaymentHistory";
import LiveSellers from "../views/SuperAdmin/LiveSellers";
import Stats from "../views/SuperAdmin/Stats";
import InvoiceDetail from "../views/SuperAdmin/InvoiceDetail";
import SellerStats from "../views/SuperAdmin/SellerStats";
import Accounts from "../views/SuperAdmin/Accounts";
import CreateAccount from "../views/SuperAdmin/CreateAccount";
import InactiveClients from "../views/SuperAdmin/InactiveClients";
import Status from "../views/SuperAdmin/Status";
import EtatDeStock from "../views/SuperAdmin/EtatDeStock";
import Header from "../components/Header";
import { SuperDataProvider } from "../components/contexts/SuperContext";
import config from "../config/config";
import DebitStatus from "../views/admin/DebitStatus";
import ClientDebitStatus from "../views/admin/ClientDebitStatus";
import InvoiceDebitStatus from "../views/admin/InvoiceDebitStatus";

const SuperAdminRoutes = () => {
  
  return (
    <SuperDataProvider>
      <Header title={config.ROLE_NAME_TEXT.SUPER_ADMIN} logout_route={config.BASE_ROUTE.SUPER_ADMIN} />
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
        {/* <Route path="/debitStatus" element={<DebitStatus />} /> */}
        {/* <Route path="/debitStatus/:idSeller" element={<ClientDebitStatus />} /> */}
        <Route path="/stockStatus" element={<EtatDeStock />} />
        {/* <Route
          path="/invoiceDebitStatus/:idClient"
          element={<InvoiceDebitStatus />}
        /> */}
        <Route path="/debitStatus" element={<DebitStatus route={config.BASE_ROUTE.SUPER_ADMIN}/>} />
        <Route path="/debitStatus/:idSeller" element={<ClientDebitStatus route={config.BASE_ROUTE.SUPER_ADMIN}/>} />
        <Route
          path="/invoiceDebitStatus/:idClient"
          element={<InvoiceDebitStatus route={config.BASE_ROUTE.SUPER_ADMIN}/>}
        />
        <Route
          path="/debitStatusInvoice/:idInvoice"
          element={<InvoiceDetail />}
        />
        <Route path="/accountManagement" element={<AccountManagement />} />
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/liveSellers" element={<LiveSellers />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/stats/sellerStats/:idSeller" element={<SellerStats />} />
      </Routes>
    </SuperDataProvider>
  );
};

export default SuperAdminRoutes;
