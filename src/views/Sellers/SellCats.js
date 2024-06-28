import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "../../assets/css/Styles/Sell.css";
import { useSellerData } from "../../components/contexts/SellerContext";
import { formatNumber } from "../../tools/global";
import { usePanierContext } from "../../components/contexts/SellContext_Old";

const SellCats = () => {
  const { idClient } = useParams();
  const {sellerData} = useSellerData();
  const { state } = usePanierContext();
  const panier = state;

  const categories = useMemo(() => sellerData.artsNcats.cats, [sellerData.artsNcats.cats]);
  const client = useMemo(() => sellerData.clients.find((client) => client._id === idClient), [idClient, sellerData.clients]);

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
                      className="multisteps-form__progress-btn"
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
                Vente au {client ? client.name : "client inconnu"}
              </h3>
              <div className="multisteps-form__content">
                <div className="card-list black-card-text">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      className="small-app-card"
                      to={`/seller/sell/arts/${category._id}`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                <table className="container mb-4">
                  <tbody>
                    <tr className="row">
                      <td className="col"></td>
                      <td className="col"></td>
                      <td className="col">
                        <strong>Total: </strong>
                      </td>
                      <td className="col">
                        <strong>{formatNumber(panier.payment)} DHS</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="button-row d-flex mt-4">
                  <button className="flat-btn-small btn-red" onClick={() => console.log('Cancel button clicked')}>
                    Annuler
                  </button>
                  <Link className="ml-auto flat-btn-small btn-blue" to={`/payer`}>
                    Terminé
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

export default SellCats;
