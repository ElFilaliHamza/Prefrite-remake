import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { fetchCategoriesAndArticles } from '../../api/sellersAPI'; // Ensure the correct path

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [panierArticles, setPanierArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategoriesAndArticles();
        setCategories(data.categories);
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching categories and articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addArticleToPanier = useCallback((articleId, quantity) => {
    setPanierArticles((prevArticles) => {
      if (!quantity) {
        return prevArticles.filter(article => article._id !== articleId);
      }

      const articleIndex = prevArticles.findIndex((article) => article._id === articleId);
      if (articleIndex !== -1) {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex].qt = quantity;
        return updatedArticles;
      }
      return [...prevArticles, { _id: articleId, qt: quantity }];
    });
  }, []);

  const contextValue = useMemo(() => ({
    categories,
    articles,
    panierArticles,
    addArticleToPanier,
    loading
  }), [categories, articles, panierArticles, addArticleToPanier, loading]);

  return (
    <PanierContext.Provider value={contextValue}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext);
