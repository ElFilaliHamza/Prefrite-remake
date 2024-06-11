import React, { createContext, useState, useContext } from "react";

const SellContext = createContext();

export const SellProvider = ({ children }) => {
  const [panier, setPanier] = useState({
    clientId: null,
    arts: [],
    payment: 0,
  });
  const [total, setTotal] = useState(0);

  const addToPanier = (art) => {
    setPanier((prevPanier) => {
      const existingArt = prevPanier.arts.find((a) => a._id === art._id);
      let updatedArts;
      if (existingArt) {
        updatedArts = prevPanier.arts.map((a) =>
          a._id === art._id ? { ...a, qt: a.qt + art.qt } : a
        );
      } else {
        updatedArts = [...prevPanier.arts, art];
      }
      return { ...prevPanier, arts: updatedArts };
    });
  };

  const removeFromPanier = (artId) => {
    setPanier((prevPanier) => ({
      ...prevPanier,
      arts: prevPanier.arts.filter((a) => a._id !== artId),
    }));
  };

  const clearPanier = () => {
    setPanier({
      clientId: null,
      arts: [],
      payment: 0,
    });
  };

  return (
    <SellContext.Provider
      value={{ panier, setPanier, addToPanier, removeFromPanier, clearPanier, total, setTotal }}
    >
      {children}
    </SellContext.Provider>
  );
};

export const useSellContext = () => useContext(SellContext);
