import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSellerData } from "../../components/contexts/SellerContext";
import { useSellContext } from "../../components/contexts/SellContext";

const Sell = () => {
  const sellerData = useSellerData();
  const { panier, setPanier } = useSellContext(); // Use the Panier context
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const updatePanier = (clientId) => {
    setPanier((prevPanier) => ({
      ...prevPanier,
      clientId,
    }));
  };
  useEffect(() => {
    if (sellerData) {
      setClients(sellerData.clients);
    }
  }, [sellerData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      className="multisteps-form__progress-btn"
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
                  {filteredClients.map((client) => (
                    <Link
                      key={client._id}
                      className="seller-client-item"
                      to={`/seller/sell/client/${client._id}`}
                      onClick={updatePanier(client._id)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{client.name}</h5>
                        <p className="card-text">ICE: {client.ICE}</p>
                        <p className="card-text">Plafon: {client.plafon}</p>
                      </div>
                    </Link>
                  ))}
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
