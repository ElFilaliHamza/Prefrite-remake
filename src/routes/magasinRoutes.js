import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import React from "react";
import config from "../config/config";
import PageNotFound from "../views/PageNotFound";
import MagasinDashboard from "../views/magasin/magasinDashboard";
import { MagasinDataProvider } from "../components/contexts/magasinContext";
import CommandsMagasin from "../views/magasin/CommandsMagasin";
import CommandDetail from "../views/admin/CommandDetail";
import CommandsHistory from "../views/admin/CommandsHistory";
import CommandStatus from "../views/magasin/CommandStatus";
import StockStatus from "../views/magasin/StatusStock";

const MagasinRoutes = () => {
  return (
    <MagasinDataProvider>
      <Header
        title={config.ROLE_NAME_TEXT.MAGASINIER}
        logout_route={config.BASE_ROUTE.MAGASIN}
      />
      <Routes>
        <Route path="/" element={<MagasinDashboard route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/magasin" element={<MagasinDashboard route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/commands" element={<CommandsMagasin route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/command/:commandId" element={<CommandDetail route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/commandHistory" element={<CommandsHistory route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/commandStatus" element={<CommandStatus route={config.BASE_ROUTE.MAGASIN} />} />
        <Route path="/stockStatus" element={<StockStatus route={config.BASE_ROUTE.MAGASIN} />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MagasinDataProvider>
  );
};

export default MagasinRoutes;
