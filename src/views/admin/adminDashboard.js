import React from "react";
import "../../assets/css/Styles/AdminDashboard.css"; // Adjust the path to your CSS file if necessary

const colors = ["#2b2d42", "#ff6f59", "#784f41", "#8e5572", "#f8c630", "#23967f", "#724e91"];


const AdminDashboard = () => {
  return (
    <div className="app-container">
      <div className="user-home">
        <div className="simple-container">
          <div className="card-list">
            <a
              className="app-card modern-app-card"
              href="/admin/vendeurs"
              style={{ backgroundColor: colors[0] }}
            >
              Vendeurs
              <div className="card-badge">
                <i className="fas fa-user"></i>
              </div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/clients"
              style={{ backgroundColor: colors[1] }}
            >
              Clients
              <div className="card-badge">
                <i className="fas fa-star"></i>
              </div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/commands"
              style={{ backgroundColor: colors[2] }}
            >
              Commandes
              <div className="card-badge">
                <i className="fas fa-terminal"></i>
              </div>
              <div className="card-status card-danger-status">1</div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/commandHistory"
              style={{ backgroundColor: colors[3] }}
            >
              Historique Commandes
              <div className="card-badge">
                <i className="fas fa-history"></i>
              </div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/debitStatus"
              style={{ backgroundColor: colors[4] }}
            >
              Credit
              <div className="card-badge card-alert">
                <i className="fas fa-bell"></i>
              </div>
              <div className="card-status-long card-danger-status">
                1022943.17
              </div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/pay"
              style={{ backgroundColor: colors[5] }}
            >
              Encaissement
              <div className="card-badge">
                <i className="fas fa-coins"></i>
              </div>
            </a>
            <a
              className="app-card modern-app-card"
              href="/admin/payments"
              style={{ backgroundColor: colors[6] }}
            >
              Historique d'Encaissement
              <div className="card-badge">
                <i className="fas fa-history"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
