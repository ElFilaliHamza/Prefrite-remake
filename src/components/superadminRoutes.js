import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SuperAdminDashboard from '../views/SuperAdmin/SuperAdminDashboard';
import Categories from '../views/SuperAdmin/Categories';
import AddCategory from '../views/SuperAdmin/AddCategory';
import CategoryDetail from '../views/SuperAdmin/CategoryDetail';
import Alerts from '../views/SuperAdmin/Alerts';
import ArticleDetail from '../views/SuperAdmin/ArticleDetail';
import AddArticle from '../views/SuperAdmin/AddArticle';
import DebitStatus from '../views/SuperAdmin/DebitStatus';
import DebitStatusDetail from '../views/SuperAdmin/DebitStatusDetail';
import AccountManagement from '../views/SuperAdmin/AccountManagement';
import PaymentHistory from '../views/SuperAdmin/PaymentHistory';
import StockStatus from '../views/SuperAdmin/StockStatus';
import LiveSellers from '../views/SuperAdmin/LiveSellers';
import OffClients from '../views/SuperAdmin/OffClients';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/addCategory" element={<AddCategory />} />
      <Route path="/category/:catId" element={<CategoryDetail />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/article/:idArt" element={<ArticleDetail />} />
      <Route path="/addArticle" element={<AddArticle />} />
      <Route path="/debitStatus" element={<DebitStatus />} />
      <Route path="/debitStatus/:idSeller" element={<DebitStatusDetail />} />
      <Route path="/accountManagement" element={<AccountManagement />} />
      <Route path="/payments" element={<PaymentHistory />} />
      <Route path="/stockStatus" element={<StockStatus />} />
      <Route path="/liveSellers" element={<LiveSellers />} />
      <Route path="/offClients" element={<OffClients />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
