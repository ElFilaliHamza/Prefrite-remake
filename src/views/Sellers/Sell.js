// src/components/Sell.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSell } from "../../components/contexts/SellContext";
import { useSellerData } from "../../components/contexts/SellerContext";

const Sell = () => {
  const navigate = useNavigate();
  const { setClient } = useSell();
  const { sellerData } = useSellerData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (sellerData && sellerData.clients) {
      setFilteredClients(sellerData.clients);
    }
  }, [sellerData]);

  useEffect(() => {
    if (sellerData && sellerData.clients) {
      setFilteredClients(
        sellerData.clients.filter(client =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, sellerData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const updatePanier = (clientId) => {
    if (sellerData && sellerData.clients) {
      const temp_client = sellerData.clients.find(client => client._id === clientId);
      setClient(temp_client);
    }
  };

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
                    <button className="multisteps-form__progress-btn" type="button">
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
              <div className="multisteps-form__content">
                <div className="flat-btn-small flat-btn-center btn-green">
                  <span>Scanner QRCode</span>
                  <i className="fas fa-qrcode"></i>
                </div>
                <div>
                  <input
                    className="form-control"
                    placeholder="Nom Client"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="seller-clients">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <Link
                        key={client._id}
                        className="seller-client-item"
                        to={`/seller/sell/client/${client._id}`}
                        onClick={() => updatePanier(client._id)}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{client.name}</h5>
                          <p className="card-text">ICE: {client.ICE}</p>
                          <p className="card-text">Plafon: {client.plafon}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No clients found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
