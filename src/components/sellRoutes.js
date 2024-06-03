import { Route, Routes, useNavigate } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";
import Header from "./Header";
import { useAppContext } from "./AppContext";
import { checkSellerAccess, fetchSellerInfo } from "../api/sellersAPI";
import config from "../config/config";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Sell from "../views/Sellers/Sell";
import SellCats from "../views/Sellers/SellCats";
import SellArticles from "../views/Sellers/SellArticles";

const SellRoutes = ({ sellerData }) => {
  const navigate = useNavigate();
  const [state, setState] = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Sell sellerData={sellerData} />} />
        <Route
          path="/client/:idClient"
          element={<SellCats sellerData={sellerData} />}
        />
        <Route
          path="/arts/:idCat"
          element={<SellArticles sellerData={sellerData} />}
        />
      </Routes>
    </>
  );
};

export default SellRoutes;
