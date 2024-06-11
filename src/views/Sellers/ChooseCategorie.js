import React, { useState, useEffect } from "react";
import { fetchCategoriesAndArticles, addCommand } from "../../api/sellersAPI";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { usePanier } from "../../components/contexts/PanierContext";

const ChooseCategorie = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPanier, setShowPanier] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { panierArticles, articles } = usePanier();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategoriesAndArticles();
      setCategories(data.categories);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getArticleName = (articleId) => {
    const article = articles.find((article) => article._id === articleId);
    return article ? article.name : "Unknown";
  };

  const handleRevision = () => {
    if (panierArticles.length > 0) {
      setShowPanier(true);
    }
  };

  const handleEffectuer = async () => {
    const response = await addCommand(panierArticles);
    if (response.ok) {
      setSuccess(true);
      setError(false);
    } else {
      setSuccess(false);
      setError(true);
    }
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
                {!showPanier && !success && (
                  <>
                    <h3 className="texttitle">Choisir une Categorie</h3>
                    <div className="card-list black-card-text">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          className="small-app-card"
                          to={`/seller/addCommand/${category._id}`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="button-row d-flex mt-4">
                      <Link className="flat-btn-small btn-red" to="/seller/">
                        Annuler
                      </Link>
                      <div
                        className="ml-auto flat-btn-small btn-blue"
                        onClick={handleRevision}
                      >
                        Révision
                      </div>
                    </div>
                  </>
                )}
                {showPanier && !success && (
                  <>
                    <h3 className="texttitle">Votre Commande</h3>
                    <table className="cmd-table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Qte</th>
                        </tr>
                      </thead>
                      <tbody>
                        {panierArticles.map((article) => (
                          <tr key={article._id} className="grid-container-fluid">
                            <td className="item">{getArticleName(article._id)}</td>
                            <td className="item">{article.qt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="info-flex">
                      <Link className="flat-btn-small btn-red" type="button" to="/seller/">
                        Annuler
                      </Link>
                      <div className="ml-auto flat-btn-small btn-blue" onClick={handleEffectuer}>
                        Effectuer
                      </div>
                    </div>
                    {error && <div className="error-message">Erreur lors de l'ajout de la commande</div>}
                  </>
                )}
                {success && (
                  <div className="multisteps-form__content">
                    <h3 className="texttitle">Commande effectuée!</h3>
                    <Link className="flat-btn-small btn-green" to="/seller/">
                      Retour
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseCategorie;
