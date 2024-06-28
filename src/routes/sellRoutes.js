import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sell from "../views/Sellers/Sell";
import SellCategories from "../components/Seller/SellCategories";
import SellPayer from "../components/Seller/SellPayer";
import SellArticles from "../components/Seller/SellArticles";
import Loading from "../components/Loading";
import PageNotFound from "../views/PageNotFound";

const SellRoutes = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
      <Routes>
        <Route path="/" element={<Sell />} />
        <Route path="/clients" element={<Sell />} />
        <Route path="/client/:idClient" element={<SellCategories />} />
        <Route path="/arts/:idCat" element={<SellArticles />} />
        <Route path="/payer" element={<SellPayer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
  );
};

export default SellRoutes;
