// src/components/SellArticles.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSellerData } from "../contexts/SellerContext";
import NumberInput from "../NumberInput";
import { formatNumber } from "../../tools/global";
import Loading from "../Loading";
import { useSell } from "../contexts/SellContext";

const SellArticles = () => {
  const { idCat } = useParams();
  const { sellerData } = useSellerData();
  const navigate = useNavigate();
  const { panierArticles, addArticleToPanier, totalPrice, client, reset } = useSell();
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    if (sellerData && sellerData.artsNcats && sellerData.artsNcats.arts) {
      const filteredArticles = sellerData.artsNcats.arts.filter((article) => article.catId === idCat);
      setFilteredArticles(filteredArticles);
    }
  }, [idCat, sellerData]);

  const handleQuantityChange = (article, quantity, price) => {
    if (quantity > 0 && article.sellerQt >= quantity) {
      addArticleToPanier(article._id, quantity, price);
    }
  };

  if (!client) {
    navigate('/seller/sell');
    return null;
  }

  if (!filteredArticles.length) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="content">
        <div className="content__inner">
          <div className="Container">
            <div className="multisteps-form">
              <div className="row switch-pane" style={{ marginBottom: "10px" }}>
                <div className="col-12 col-lg-8 ml-auto mr-auto m">
                  <div className="multisteps-form__progress">
                    <button className="multisteps-form__progress-btn js-active" type="button">
                      Clients
                    </button>
                    <button className="multisteps-form__progress-btn js-active" type="button">
                      Choisissez une catégorie
                    </button>
                    <button className="multisteps-form__progress-btn js-active" type="button">
                      Choisir un article
                    </button>
                    <button className="multisteps-form__progress-btn" type="button">
                      Payer
                    </button>
                    <button className="multisteps-form__progress-btn" type="button">
                      Facture d'achat
                    </button>
                  </div>
                </div>
              </div>
              <h3 style={{ textAlign: "center", margin: "10px auto", textDecoration: "underline" }}>
                Articles de la catégorie:{" "}
                {sellerData.artsNcats.cats.find((cat) => cat._id === idCat)?.name}
              </h3>
              <div className="md-form mt-0">
                <input className="form-control" type="text" placeholder="Rechercher" />
              </div>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Qt Disp</th>
                    <th>Qte</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => {
                    const panierArticle = panierArticles.find(a => a._id === article._id) || {};
                    return (article.sellerQt > 0 &&
                      <tr key={article._id}>
                        <td>{article.name}</td>
                        <td>{article.sellerQt}</td>
                        <td>
                          <NumberInput
                            value={panierArticle.qt || ""}
                            onChange={(e) =>
                              handleQuantityChange(article, parseFloat(e.target.value) || 0, article.prixVente)
                            }
                          />
                        </td>
                        <td>{article.prixVente} DHS</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>Total: </strong>
                    </td>
                    <td>
                      <strong>{formatNumber(totalPrice)} DHS</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="button-row d-flex mt-4">
                <button className="flat-btn-small btn-red" onClick={() => {
                  navigate('/seller/sell/');
                  reset();
                }}>
                  Annuler
                </button>
                <button className="ml-auto flat-btn-small btn-blue" onClick={() => navigate(`/seller/sell/client/${client._id}`)}>
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellArticles;
