import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSellContext } from "../../components/contexts/SellContext";
import { useSellerData } from "../../components/contexts/SellerContext";

const SellArticles = () => {
  const { idCat } = useParams();
  const { panier, addToPanier, total, setTotal } = useSellContext(); // Use the Panier context
  const sellerData = useSellerData(); // Use the Seller context
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (sellerData && sellerData.artsNcats && sellerData.artsNcats.arts) {
      const filteredArticles = sellerData.artsNcats.arts.filter(
        (article) => article.catId === idCat
      );
      setArticles(filteredArticles);
    }
  }, [idCat, sellerData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleQuantityChange = (articleId, quantity) => {
    if (quantity < 0) return; // Prevent negative values
    const newQuantities = {
      ...quantities,
      [articleId]: quantity,
    };
    setQuantities(newQuantities);
    computeTotal(newQuantities);
  };

  const computeTotal = (quantities) => {
    const newTotal = articles.reduce((acc, article) => {
      const quantity = quantities[article._id] || 0;
      return acc + quantity * article.prixVente;
    }, 0);
    setTotal((oldTotal)=>(
      oldTotal + newTotal 
    ));
  };

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = () => {
    articles.forEach((article) => {
      const quantity = quantities[article._id];
      if (quantity > 0) {
        addToPanier({ ...article, qt: quantity });
      }
    });
    navigate(`/seller/sell/client/${panier.clientId}`);
  };

  if (!articles.length) {
    return <div>Loading...</div>;
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
                    <button
                      className="multisteps-form__progress-btn js-active"
                      type="button"
                    >
                      Clients
                    </button>
                    <button
                      className="multisteps-form__progress-btn js-active"
                      type="button"
                    >
                      Choisissez une catégorie
                    </button>
                    <button
                      className="multisteps-form__progress-btn js-active"
                      type="button"
                    >
                      Choisir un article
                    </button>
                    <button
                      className="multisteps-form__progress-btn"
                      type="button"
                    >
                      Payer
                    </button>
                    <button
                      className="multisteps-form__progress-btn"
                      type="button"
                    >
                      Facture d'achat
                    </button>
                  </div>
                </div>
              </div>
              <h3
                style={{
                  textAlign: "center",
                  margin: "10px auto",
                  textDecoration: "underline",
                }}
              >
                Articles de la catégorie:{" "}
                {
                  sellerData.artsNcats.cats.find((cat) => cat._id === idCat)
                    ?.name
                }
              </h3>
              <div className="md-form mt-0">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Rechercher"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
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
                  {filteredArticles.map((article) => (
                    <tr key={article._id}>
                      <td>{article.name}</td>
                      <td>{article.qtStocke}</td>
                      <td>
                        <input
                          className="form-control"
                          type="number"
                          step="any"
                          min="0" // Enforce non-negative values
                          value={quantities[article._id] || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              article._id,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </td>
                      <td>{article.prixVente} DHS</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>Total: </strong>
                    </td>
                    <td>
                      <strong>{total.toFixed(2)} DHS</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="button-row d-flex mt-4">
                <button
                  className="flat-btn-small btn-red"
                  onClick={() => navigate('/')}
                >
                  Annuler
                </button>
                <button
                  className="ml-auto flat-btn-small btn-blue"
                  onClick={handleAddToCart}
                >
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
