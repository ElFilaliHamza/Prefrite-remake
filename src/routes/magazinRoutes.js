import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import React from "react";
import config from "../config/config";
import MagazinDashboard from "../views/magazin/magazinDashboard";

const MagazinRoutes = () => {
  return (
    <MagazinDataProvider>
      <Header
        title={config.ROLE_NAME_TEXT.MAGASINIER}
        logout_route={config.BASE_ROUTE.MAGASIN}
      />
      <Routes>
        <Route path="/" element={<MagazinDashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MagazinDataProvider>
  );
};

export default MagazinRoutes;
