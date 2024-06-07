import React from "react";
import { Routes, Route } from "react-router-dom";
import SellArticles from "../views/Sellers/SellArticles";
import Sell from "../views/Sellers/Sell";
import { SellProvider } from "../components/contexts/SellContext";
import SellCats from "../views/Sellers/SellCats";

const App = () => (
  <>
    <SellProvider>
      <Routes>
        <Route path="/" element={<Sell />} />
        <Route path="/clients" element={<Sell />} />
        <Route path="/arts/:idCat" element={<SellArticles />} />
        <Route path="/client/:idClient" element={<SellCats />} />
      </Routes>
    </SellProvider>
  </>
);

export default App;
