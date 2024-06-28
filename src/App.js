import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/css/main.css";
import "./assets/css/styles.css";
import WebSocketManager from "./components/WebSocketManager";
import SuperAdminRoutes from "./routes/superadminRoutes";
import SellerRoutes from "./routes/sellerRoutes";
import Login from "./views/Login";
import { AppProvider } from "./components/contexts/AppContext";
import PageNotFound from "./views/PageNotFound";
import AdminRoutes from "./routes/adminRoutes";
import { SellerDataProvider } from "./components/contexts/SellerContext";
import MagasinRoutes from "./routes/magasinRoutes";
import { SellProvider } from "./components/contexts/SellContext";
import { PanierProvider } from "./components/contexts/PanierContext";

const App = () => {
  return (
    <PanierProvider>
      <SellProvider>
        <Router>
          <AppProvider>
            <SellerDataProvider>
              <WebSocketManager />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/magasin/*" element={<MagasinRoutes />} />
                <Route
                  path="/seller/*"
                  element={
                    <SellerRoutes />
                  }
                />
                {/* <Route path="/magasin/*" element={<MagasinRoutes />} /> */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </SellerDataProvider>
          </AppProvider>
        </Router>
      </SellProvider>
    </PanierProvider>
  );
};

export default App;
