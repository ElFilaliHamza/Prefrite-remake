import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import PageNotFound from '../views/PageNotFound';
import Home from '../views/Home';
import Login from '../views/Login';
import WebSocketManager from './WebSocketManager';
import SuperAdminRoutes from './superadminRoutes';
import SellerRoutes from './sellerRoutes';
import '../assets/css/main.css';
import '../assets/css/Styles/Styles.css';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <WebSocketManager />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
          <Route path="/seller/*" element={<SellerRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
