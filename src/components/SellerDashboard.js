// src/views/Seller/SellerDashboard.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/css/Styles/SellerDashboard.css'; // Custom CSS for styling

const SellerDashboard = () => {
  const location = useLocation();
  const sellerData = location.state?.sellerData;
  console.log("sellerData");
  console.log(sellerData);
  if (!sellerData) {
    return <div>Error loading seller data</div>;
  }

  const { stats } = sellerData?.artsNcats.stats || {};

  return (
    <div className="seller-container">
      <div className="header">
        <h1>Younes</h1>
      </div>
      <div className="card-container">
        <div className="card">
          <div className="card-title">Vente <i className="fas fa-money-bill"></i></div>
        </div>
        <div className="card">
          <div className="card-title">Bon de livraison <i className="fas fa-clipboard-list"></i></div>
        </div>
        <div className="card">
          <div className="card-title">Stock Mobile <i className="fas fa-box"></i></div>
        </div>
        <div className="card">
          <div className="card-title">Commander <i className="fas fa-terminal"></i></div>
        </div>
        <div className="card">
          <div className="card-title">Commandes <i className="fas fa-sync"></i></div>
        </div>
        <div className="card">
          <div className="card-title">Revenu: {stats?.profit || '0'} DHS</div>
        </div>
        <div className="card">
          <div className="card-title">My Commission: {stats?.profit || '0'} DHS</div>
        </div>
        <div className="card">
          <div className="card-title">Credit: {stats?.credit || '0'} DHS</div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
