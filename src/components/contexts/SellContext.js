// src/contexts/SellContext.js
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const SellContext = createContext();

export const SellProvider = ({ children }) => {
  const [panierArticles, setPanierArticles] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [client, setClient] = useState(null);

  const addArticleToPanier = (articleId, quantity, price) => {
    setPanierArticles((prevArticles) => {
      if (!quantity) {
        return prevArticles.filter(article => article._id !== articleId);
      }

      const articleIndex = prevArticles.findIndex(article => article._id === articleId);
      if (articleIndex !== -1) {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex].qt = quantity;
        updatedArticles[articleIndex].price = price;
        return updatedArticles;
      }
      return [...prevArticles, { _id: articleId, qt: quantity, price }];
    });
  };

  useEffect(() => {
    const total = panierArticles.reduce((sum, article) => sum + (article.price * article.qt), 0);
    setTotalPrice(total);
  }, [panierArticles]);

  const reset = () => {
    setPanierArticles([]);
    setTotalPrice(0);
    setClient(null);
  };

  const contextValue = useMemo(() => ({
    panierArticles,
    totalPrice,
    addArticleToPanier,
    client,
    setClient,
    reset
  }), [panierArticles, totalPrice, client]);

  return (
    <SellContext.Provider value={contextValue}>
      {children}
    </SellContext.Provider>
  );
};

export const useSell = () => useContext(SellContext);
