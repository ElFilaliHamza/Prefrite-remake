// src/views/SuperAdmin/Status.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDebitCount } from "../../api/debitAPI";
import "../../assets/css/Styles/Status.css"; // Custom CSS for styling
import Loading from "../../components/Loading";
import { requestSellerAccess, createSellerSession, downloadDatabaseBackup } from "../../api/extraAPI";

const Status = () => {
  const [debitCount, setDebitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDebitCount().then((count) => {
      setDebitCount(count);
      setLoading(false);
    });
  }, []);

  

  

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <a className="home-link" href="/superadmin">
          <i className="fas fa-home"></i>
        </a>
      </div>
      <div className="card-container">
        <Link
          to="/superadmin/stockStatus"
          className="app-card modern-app-card card-c-9"
        >
          Etat Stocke
          <div className="card-badge">
            <i className="fas fa-leaf"></i>
          </div>
        </Link>
        <Link
          to="/superadmin/debitStatus"
        >
          <div className="app-card modern-app-card card-c-2">
            Credit
            <div className="card-badge card-alert">
              <i className="fas fa-bell"></i>
            </div>
            <div className="card-status-long card-danger-status">
              {debitCount}
            </div>
          </div>
        </Link>
        <div
          className="app-card modern-app-card card-c-8"
          onClick={downloadDatabaseBackup}
        >
          Base de Données
          <div className="card-badge">
            <i className="fas fa-database"></i>
          </div>
          <div className="card-status card-success-status">
            <i className="fas fa-arrow-down"></i>
          </div>
        </div>
        {/* <div
          className="app-card modern-app-card card-c-9"
          onClick={handleVenteClick}
        >
          Vente
          <div className="card-badge">
            <i className="fas fa-money-bill"></i>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Status;
