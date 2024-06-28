import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

const SellContext = createContext();

export const SellProvider = ({ children }) => {
  const [panierArticles, setPanierArticles] = useState([]);
  const [client, setClient] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to calculate the total price
  const calculateTotalPrice = useCallback(() => {
    const total = panierArticles.reduce((total, article) => {
      return total + (article.price * article.qt);
    }, 0);
    setTotalPrice(total);
  }, [panierArticles]); // Added panierArticles as dependency

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching data
      calculateTotalPrice();
    };

    fetchData();
  }, [calculateTotalPrice]); // Added calculateTotalPrice as dependency

  // Function to add or update articles in the cart
  const addArticleToPanier = useCallback((articleId, quantity, price) => {
    setPanierArticles((prevArticles) => {
      if (!quantity) {
        return prevArticles.filter(article => article._id !== articleId);
      }

      const articleIndex = prevArticles.findIndex((article) => article._id === articleId);
      if (articleIndex !== -1) {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex].qt = quantity;
        updatedArticles[articleIndex].price = price; // Ensure the price is updated
        return updatedArticles;
      }
      return [...prevArticles, { _id: articleId, qt: quantity, price }];
    });
  }, []);

  useEffect(() => {
    calculateTotalPrice(); // Calculate total price whenever panierArticles changes
  }, [panierArticles, calculateTotalPrice]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    panierArticles,
    addArticleToPanier,
    client,
    setClient,
    totalPrice,
  }), [panierArticles, addArticleToPanier, client, totalPrice]);

  return (
    <SellContext.Provider value={contextValue}>
      {children}
    </SellContext.Provider>
  );
};

export const useSell = () => useContext(SellContext);
