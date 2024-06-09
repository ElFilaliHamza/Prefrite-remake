import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePanierContext } from "../../components/contexts/SellContext";
import { useSellerData } from "../../components/contexts/SellerContext";
import Loading from "../../components/Loading";
import { buyArts } from "../../api/payments";
import { formatNumber } from "../../tools/global";

const SellPayer = () => {
  const { panier, setPanier } = usePanierContext();
  const sellerData = useSellerData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(0);

  useEffect(() => {
    if (panier.arts.length > 0) {
      const total = panier.arts.reduce((acc, article) => acc + article.qt * article.price, 0);
      setPayment(total);
      setPanier(prevPanier => ({
        ...prevPanier,
        payment: total,
      }));
    }
    setLoading(false);
  }, [panier.arts, setPanier]);

  const clientInfo = sellerData.clients.find(client => client._id === panier.clientId);

  if (loading || !clientInfo) {
    return <Loading />;
  }

  const handlePaymentChange = (e) => {
    setPayment(e.target.value);
    setPanier(prevPanier => ({
      ...prevPanier,
      payment: e.target.value,
    }));
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const data = await buyArts({
        clientId: panier.clientId,
        arts: panier.arts,
        payment,
      });
      if (data.paymentExceeded) {
        alert("Payment exceeded the total amount.");
      } else if (data.debitExceeded) {
        alert("Debit exceeded the permitted amount.");
      } else if (data.error) {
        alert(data.errorMessage || "An error occurred.");
      } else {
        navigate("/seller");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const invoice = {
    client: {
      name: clientInfo.name,
      ice: clientInfo.ice,
    },
    products: panier.arts,
    total: panier.arts.reduce((acc, article) => acc + article.qt * article.price, 0),
    paid: payment,
  };

  return (
    <div className="app-container">
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
                    <button className="multisteps-form__progress-btn js-active" type="button">
                      Payer
                    </button>
                    <button className="multisteps-form__progress-btn" type="button">
                      Facture d'achat
                    </button>
                  </div>
                </div>
              </div>
              <div className="multisteps-form__content">
                <h3 style={{ textAlign: "center", margin: "10px auto", textDecoration: "underline" }}>
                  Vente au {invoice.client.name}
                </h3>
                <h2 className="text-center">Paiement</h2>
                <div className="invoice-card">
                  <div className="invoice-title">
                    <div className="main-title">
                      <h4 className="company-name seller-company-name">Prefrite</h4>
                    </div>
                    <div className="invoice-info">
                      <div className="invoice-info-item">CLIENT : {invoice.client.name}</div>
                      <div className="invoice-info-item">ICE : {invoice.client.ice}</div>
                      <div className="invoice-info-item">DATE : {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="invoice-details">
                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <td className="invoice-details-item">PRODUIT</td>
                          <td className="invoice-details-item">QTE</td>
                          <td className="invoice-details-item">PRIX</td>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.products.map((product) => (
                          <tr key={product._id}>
                            <td className="invoice-item">{product.name}</td>
                            <td className="invoice-item">{product.qt}</td>
                            <td className="invoice-item">
                              {formatNumber(product.price)} DHS
                              {product.price && product.qt ? (
                                <div className="price-calcul">
                                  ({product.qt} * {formatNumber(product.price)} DHS)
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="invoice-footer-details">
                    <table className="invoice-table">
                      <tbody>
                        <tr className="footer-item">
                          <th className="total">TOTAL:</th>
                          <td className="total">{invoice.total} DHS</td>
                        </tr>
                        <tr className="footer-item">
                          <th className="total">TOTAL PAYÉ:</th>
                          <td className="total">{invoice.paid} DHS</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <table className="container mb-4 table-hover table-sortable">
                  <thead></thead>
                  <tbody>
                    <tr className="row">
                      <td className="col">
                        <strong>Total: </strong>
                      </td>
                      <td className="col">
                        <strong>{invoice.total} DHS</strong>
                      </td>
                    </tr>
                    <tr className="row">
                      <td className="col">
                        <strong>Plafon: </strong>
                      </td>
                      <td className="col">
                        <strong>{clientInfo.plafon} DHS</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="container mb-4 table-hover table-sortable">
                  <thead></thead>
                  <tbody>
                    <tr className="row">
                      <td className="col">
                        <input
                          type="number"
                          step="any"
                          className="form-control"
                          placeholder="Payer"
                          value={payment}
                          onChange={handlePaymentChange}
                        />
                        <div className="invalid-feedback">Plafond dépassé</div>
                      </td>
                      <td className="col">
                        <div className="btn btn-primary ml-auto js-btn-next" onClick={handlePay}>
                          Payer
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPayer;
