import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAlertsCount } from '../../api/alertsAPI';
// import { checkSellerAccess } from '../../api/sellersAPI';
// import '../../assets/css/main.css'; // Custom CSS for styling
import PathNav from '../../components/PathNav';

const SuperAdminDashboard = () => {
  const [alertsCount, setAlertsCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAlertsCount = async () => {
      try {
        const count = await fetchAlertsCount();
        setAlertsCount(count);
      } catch (error) {
        console.error('Error fetching alerts count:', error);
      }
    };

    getAlertsCount();
  }, []);
  
  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="card-list">
          <Link className="app-card modern-app-card card-c-1" to="/superadmin/categories">
            Categories
            <div className="card-badge"><i className="fas fa-list"></i></div>
          </Link>
          <Link className="app-card modern-app-card card-c-2" to="/superadmin/alerts">
            Alertes
            <div className="card-badge card-alert"><i className="fas fa-bell"></i></div>
            <div className="card-status card-danger-status">{alertsCount !== null ? alertsCount : 'Loading...'}</div>
          </Link>
          <Link className="app-card modern-app-card card-c-3" to="/superadmin/stats">
            Statistiques
            <div className="card-badge"><i className="fas fa-chart-line"></i></div>
          </Link>
          <Link className="app-card modern-app-card card-c-4" to="/superadmin/accounts">
            Comptes
            <div className="card-badge"><i className="fas fa-envelope"></i></div>
          </Link>
          <Link className="app-card modern-app-card card-c-5" to="/superadmin/inactiveClients">
            Clients Inactives
            <div className="card-badge"><i className="fas fa-star"></i></div>
          </Link>
          <Link className="app-card modern-app-card card-c-6" to="/superadmin/liveSellers">
            Vendeurs En Ligne
            <div className="card-badge"><i className="fas fa-wifi"></i></div>
            <div className="card-status card-danger-status"><i className="fas fa-times"></i></div>
          </Link>
          <a className="app-card modern-app-card card-c-7" href="/seller">
            Vente
            <div className="card-badge"><i className="fas fa-truck"></i></div>
          </a>
          <Link className="app-card modern-app-card card-c-8" to="/superadmin/payments">
            Encaissement
            <div className="card-badge"><i className="fas fa-coins"></i></div>
          </Link>
          <Link className="app-card modern-app-card card-c-9" to="/superadmin/status">
            Etat
            <div className="card-badge"><i className="fas fa-leaf"></i></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
