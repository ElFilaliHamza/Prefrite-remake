// src/views/Seller/SellerDashboard.js

import React, { useState, useEffect } from 'react';
import { requestSellerAccess, createSellerSession, fetchSellerInfo } from '../api/sellersAPI';
import '../assets/css/Styles/SellerDashboard.css'; // Custom CSS for styling
import Loading from './Loading';

const SellerDashboard = () => {
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSellerPage = async () => {
      try {
        const accessGranted = await requestSellerAccess();
        if (accessGranted) {
          const sessionCreated = await createSellerSession();
          if (sessionCreated) {
            const data = await fetchSellerInfo();
            setSellerData(data);
          }
        }
      } catch (error) {
        console.error("Error initializing seller page:", error);
      } finally {
        setLoading(false);
      }
    };

    initSellerPage();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!sellerData) {
    return <div>Error loading seller data</div>;
  }

  const { stats } = sellerData?.artsNcats || {};

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
          <div className="card-title">Revenu: {stats?.totalRevenue || '0'} DHS</div>
        </div>
        <div className="card">
          <div className="card-title">My Commission: {stats?.totalCommission || '0'} DHS</div>
        </div>
        <div className="card">
          <div className="card-title">Credit: {stats?.totalCredit || '0'} DHS</div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
