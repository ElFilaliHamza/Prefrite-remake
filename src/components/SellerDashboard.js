import React from "react";
import "../assets/css/Styles/SellerDashboard.css"; // Custom CSS for styling
import { Link } from "react-router-dom";
import { useSellerData } from "./SellerDataContext";

const SellerDashboard = () => {
  const sellerData = useSellerData();

  if (!sellerData) {
    return <div>Error loading seller data</div>;
  }

  const stats = sellerData?.artsNcats?.stats || {
    _id: null,
    sold: 0,
    paid: 0,
    profit: 0,
    credit: 0,
    debit: 0,
    leftToSell: 0,
  };

  const formatNumber = (number) => (number ? number.toFixed(2) : "0.00");

  return (
    <div className="seller-container">
      <div className="card-container">
        <Link to={`/seller/sell`}>
          <div className="card">
            <div className="card-title">
              Vente <i className="fas fa-money-bill"></i>
            </div>
          </div>
        </Link>
        <div className="card">
          <div className="card-title">
            Bon de livraison <i className="fas fa-clipboard-list"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            Stock Mobile <i className="fas fa-box"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            Commander <i className="fas fa-terminal"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            Commandes <i className="fas fa-sync"></i>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            Revenu: <br />
            <span>{formatNumber(stats.profit)} DHS</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            My Commission: <br />
            <span>{formatNumber(stats.profit * 0.02)} DHS</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">
            Credit: <br />
            <span>{formatNumber(stats.credit)} DHS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
