import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDebitCount } from "../../api/debitAPI";
import Loading from "../../components/Loading";
import { downloadDatabaseBackup } from "../../api/extraAPI";

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
    <div className="app-container">

      <div className="simple-container">

        <div className="card-list">
          <Link className="app-card modern-app-card card-c-9" to="/superadmin/stockStatus">
            Etat Stocke
            <div className="card-badge">
              <i className="fas fa-leaf"></i>
            </div>
          </Link>
          <Link className="app-card modern-app-card card-c-2" to="/superadmin/debitStatus">
            Credit
            <div className="card-badge card-alert">
              <i className="fas fa-bell"></i>
            </div>
            <div className="card-status-long card-danger-status">
              {debitCount}
            </div>
          </Link>
          <div className="app-card modern-app-card card-c-8" onClick={downloadDatabaseBackup}>
            Base de Données
            <div className="card-badge">
              <i className="fas fa-database"></i>
            </div>
            <div className="card-status card-success-status">
              <i className="fas fa-arrow-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
