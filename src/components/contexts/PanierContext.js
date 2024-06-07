import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchCategoriesAndArticles } from '../../api/sellersAPI'; // Ensure the correct path

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [panierArticles, setPanierArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategoriesAndArticles();
      setCategories(data.categories);
      setArticles(data.articles);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addArticleToPanier = (articleId, quantity) => {
    setPanierArticles((prevArticles) => {
      // Filter out the article if the quantity is 0
      if (!quantity) {
        return prevArticles.filter(article => article._id !== articleId);
      }

      // Add or update the article in the panier
      const articleIndex = prevArticles.findIndex((article) => article._id === articleId);
      if (articleIndex !== -1) {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex].qt = quantity;
        return updatedArticles;
      }
      return [...prevArticles, { _id: articleId, qt: quantity }];
    });
  };

  return (
    <PanierContext.Provider value={{ categories, articles, panierArticles, addArticleToPanier, loading }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext);
