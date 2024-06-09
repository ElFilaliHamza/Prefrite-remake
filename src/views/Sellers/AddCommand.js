import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { usePanierContext } from "../../components/contexts/SellContext";

const AddCommand = () => {
  const { idCat } = useParams();
  const { articles, addArticleToPanier, loading } = usePanierContext();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [articleQuantities, setArticleQuantities] = useState({});

  // Utility function to find articles by category
  const findArtsByCat = (idCat, articles) => {
    if (!articles) {
      return [];
    }
    return articles.filter((article) => article.catId === idCat);
  };

  useEffect(() => {
    if (articles) {
      const articlesByCat = findArtsByCat(idCat, articles);
      setFilteredArticles(articlesByCat);

      // Initialize article quantities state
      const initialQuantities = {};
      articlesByCat.forEach((article) => {
        initialQuantities[article._id] = article.qt || 0;
      });
      setArticleQuantities(initialQuantities);
    }
  }, [idCat, articles]);

  const handleQuantityChange = (articleId, quantity) => {
    setArticleQuantities((prevQuantities) => ({
      ...prevQuantities,
      [articleId]: quantity,
    }));
    addArticleToPanier(articleId, quantity);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="content">
      <div className="content__inner">
        <div className="Container">
          <div className="multisteps-form">
            <div className="">
              <div className="multisteps-form__content">
                <h3 className="texttitle">Choisir les Articles</h3>
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Qt Vndr</th>
                      <th>Qt S</th>
                      <th>Qt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article._id}>
                        <td>{article.name}</td>
                        <td>{article.sellerQt}</td>
                        <td>{article.qtStocke}</td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            step="any"
                            value={article.qt}
                            onChange={(e) =>
                              handleQuantityChange(
                                article._id,
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="button-row d-flex mt-4">
                  <Link
                    className="flat-btn-small btn-red"
                    type="button"
                    to="/seller/"
                  >
                    Annuler
                  </Link>
                  <Link
                    className="ml-auto flat-btn-small btn-blue"
                    to="/seller/addCommand"
                  >
                    Suivant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommand;
