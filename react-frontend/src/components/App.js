import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Header from './Header';
import PageNotFound from '../views/PageNotFound';
import Home from '../views/Home';
import Seller from '../views/Seller';
import Invoices from '../views/Invoices';
import InvoiceDetail from '../views/InvoiceDetail';
import Stats from '../views/Stats';
import Login from '../views/login';
import WebSocketManager from './WebSocketManager';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Header />
        <WebSocketManager />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seller/*" element={<Seller />} />
          <Route exact path="/invoices" element={<Invoices />} />
          <Route path="/invoice/:_id" element={<InvoiceDetail />} />
          <Route exact path="/stats" element={<Stats />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
