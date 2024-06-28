import React from "react";
import { Routes, Route } from "react-router-dom";
import Clients from "./temp/Clients";
import Categories from "./temp/Categories";
import Articles from "./temp/Articles";
import Checkout from "./temp/Checkout";

const ShopRoutes = () => {

  return (
      <Routes>
        <Route path="/" element={<Clients />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
  );
};

export default ShopRoutes;
