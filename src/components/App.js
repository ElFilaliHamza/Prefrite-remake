import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Header from './Header';
import PageNotFound from '../views/PageNotFound';
import Home from '../views/Home';
import Login from '../views/Login';
import WebSocketManager from './WebSocketManager';
import SuperAdminRoutes from './superadminRoutes' 
import '../assets/css/main.css';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Header />
        <WebSocketManager />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
