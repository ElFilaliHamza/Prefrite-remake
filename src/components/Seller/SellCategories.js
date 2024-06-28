// src/components/SellCategories.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerData } from '../contexts/SellerContext';
import { useSell } from '../contexts/SellContext';
import { formatNumber } from '../../tools/global';

const SellCategories = () => {
  const navigate = useNavigate();
  const { sellerData } = useSellerData();
  const { client, totalPrice, reset } = useSell();
  const categories = sellerData?.artsNcats.cats;

  if (!client) {
    navigate('/seller/sell');
    return <>No client</>;
  }

  if (!categories) {
    return <>No categories found</>;
  }

  return (
    <div className="app-container">
      <div className="content">
        <div className="content__inner">
          <div className="Container">
            <div className="multisteps-form">
              <div className="">
                <div className="row switch-pane" style={{ marginBottom: "10px" }}>
                  <div className="col-12 col-lg-8 ml-auto mr-auto m">
                    <div className="multisteps-form__progress">
                      <button className="multisteps-form__progress-btn js-active" type="button">
                        Clients
                      </button>
                      <button className="multisteps-form__progress-btn js-active" type="button">
                        Choisissez une catégorie
                      </button>
                      <button className="multisteps-form__progress-btn" type="button">
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
                  Vente au {client.name}
                </h3>
                <div className="multisteps-form__content">
                  <div className="card-list black-card-text">
                    {categories.map(category => (
                      <Link
                        key={category._id}
                        className="small-app-card"
                        to={`/seller/sell/arts/${category._id}`}
                        state={{ category }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <table className="container mb-4">
                    <thead></thead>
                    <tbody>
                      <tr className="row">
                        <td className="col"></td>
                        <td className="col"></td>
                        <td className="col">
                          <strong>Total: </strong>
                        </td>
                        <td className="col">
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
                    <button className="ml-auto flat-btn-small btn-blue" onClick={() => navigate('/seller/sell/payer')}>
                      Terminé
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCategories;
