import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { PanierProvider } from "./contexts/PanierContext";
import ChooseCategorie from "../views/Sellers/ChooseCategorie";
import AddCommand from "../views/Sellers/AddCommand";

const AddCmdRoutes = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <PanierProvider>
      <Routes>
        <Route path="/" element={<ChooseCategorie />} />
        <Route path="/:idCat" element={<AddCommand />} />
      </Routes>
    </PanierProvider>
  );
};

export default AddCmdRoutes;
