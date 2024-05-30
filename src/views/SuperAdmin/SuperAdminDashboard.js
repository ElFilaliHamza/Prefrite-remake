import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Styles/SuperAdminDashboard.css'; // Custom CSS for styling
import { fetchAlertsCount } from '../../api/alertsAPI';


const SuperAdminDashboard = () => {
  const [alertsCount, setAlertsCount] = useState(null);

  useEffect(() => {
    const getAlertsCount = async () => {
      try {
        const count = await fetchAlertsCount();
        console.log("count: "+count)
        setAlertsCount(count);
      } catch (error) {
        console.error('Error fetching alerts count:', error);
      }
    };

    getAlertsCount();
  }, []);
    
  
  return (
    <div className="dashboard-container">
      <div className="card-container">
        <Link to="/superadmin/categories" className="dashboard-card card-categories">
          <div className="card-icon"><i className="fas fa-list"></i></div>
          <div className="card-title">Categories</div>
        </Link>
        <Link to="/superadmin/alerts" className="dashboard-card card-alerts">
          <div className="card-icon"><i className="fas fa-bell"></i></div>
          <div className="card-title">Alertes</div>
          <div className="card-badge">{alertsCount !== null ? alertsCount : 'Loading...'}</div>
        </Link>
        <Link to="/superadmin/stats" className="dashboard-card card-stats">
          <div className="card-icon"><i className="fas fa-chart-bar"></i></div>
          <div className="card-title">Statistiques</div>
        </Link>
        <Link to="/superadmin/accounts" className="dashboard-card card-accounts">
          <div className="card-icon"><i className="fas fa-envelope"></i></div>
          <div className="card-title">Comptes</div>
        </Link>
        <Link to="/superadmin/inactiveClients" className="dashboard-card card-inactive-clients">
          <div className="card-icon"><i className="fas fa-star"></i></div>
          <div className="card-title">Clients Inactives</div>
        </Link>
        <Link to="/superadmin/LiveSellers" className="dashboard-card card-online-sellers">
          <div className="card-icon"><i className="fas fa-wifi"></i></div>
          <div className="card-title">Vendeurs En Ligne</div>
          <div className="card-badge">X</div> {/* Replace X with dynamic count if available */}
        </Link>
        <Link to="/superadmin/sales" className="dashboard-card card-sales">
          <div className="card-icon"><i className="fas fa-truck"></i></div>
          <div className="card-title">Vente</div>
        </Link>
        <Link to="/superadmin/payments" className="dashboard-card card-payments">
          <div className="card-icon"><i className="fas fa-coins"></i></div>
          <div className="card-title">Encaissement</div>
        </Link>
        <Link to="/superadmin/status" className="dashboard-card card-status">
          <div className="card-icon"><i className="fas fa-leaf"></i></div>
          <div className="card-title">Etat</div>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
