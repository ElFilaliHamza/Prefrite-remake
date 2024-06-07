import React, { useEffect, useState } from "react";
import { fetchAccounts } from "../../api/accountsAPI";
import config from "../../config/config";
import Loading from "../../components/Loading";
import api from "../../api/api";
import { Link } from "react-router-dom";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    fetchAccounts()
      .then((new_accounts) => {
        setAccounts(new_accounts);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const toggleCardExpansion = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
    setEditMode(null);
  };

  const startEdit = (account) => {
    setEditMode(account._id);
    setUpdatedName(account.name);
  };

  const handleUpdate = async (account) => {
    try {
      await api.post("/superadmin/accounts/update", {
        _id: account._id,
        name: updatedName,
        type: account.type,
      });
      const updatedAccounts = accounts.map((acc) =>
        acc._id === account._id ? { ...acc, name: updatedName } : acc
      );
      setAccounts(updatedAccounts);
      setEditMode(null);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const categorizeAccounts = (accounts) => {
    const categories = {
      sellers: [],
      super_sellers: [],
      admins: [],
      magasiniers: [],
      super_admins: [],
    };

    accounts.forEach((account) => {
      if (account.type === config.ROLE_NAME.SELLER && account.superSeller) {
        categories.super_sellers.push(account);
      } else if (account.type === config.ROLE_NAME.SELLER) {
        categories.sellers.push(account);
      } else if (account.type === config.ROLE_NAME.ADMIN) {
        categories.admins.push(account);
      } else if (account.type === config.ROLE_NAME.MAGASIN) {
        categories.magasiniers.push(account);
      } else if (account.type === config.ROLE_NAME.SUPER_ADMIN) {
        categories.super_admins.push(account);
      }
    });

    return categories;
  };

  const categories = categorizeAccounts(accounts);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="card-list superusers-list">
          <Link className="app-card" to="/superadmin/accounts/create">
            Créer un compte
            <div className="card-badge card-user">
              <i className="fas fa-plus"></i>
            </div>
          </Link>
        </div>
        {Object.entries(categories).map(([categoryName, categoryAccounts]) => (
          <React.Fragment key={categoryName}>
            <div className="superusers-title">
              {config.ROLE_NAME_TEXT[categoryName.toUpperCase()]}:
            </div>
            <div className="card-list superusers-list">
              {categoryAccounts.map((account) => (
                <div key={account._id} className={`app-card superusers-card`}>
                  <div className="superusers-info superusers-info-flex">
                    <div>
                      <i className="fas fa-address-book"></i>
                      {editMode === account._id ? (
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        <span className="superusers-info-text">
                          {account.name}
                        </span>
                      )}
                    </div>
                    <div className="super-card-badge">
                      <i className="fas fa-truck"></i>
                    </div>
                  </div>
                  {expandedCard === account._id && (
                    <div className="superusers-info superusers-info-more">
                      <div>
                        <i className="fas fa-user"></i>
                        <span className="superusers-info-text">
                          {account.username}
                        </span>
                      </div>
                      <div>
                        <i className="fas fa-lock"></i>
                        <span className="superusers-info-text">
                          {account.password}
                        </span>
                      </div>
                    </div>
                  )}
                  {expandedCard === account._id && (
                    <div className="superusers-actions">
                      {editMode === account._id ? (
                        <>
                          <div
                            className="superusers-action-btn"
                            onClick={() => handleUpdate(account)}
                          >
                            <i className="fas fa-check"></i>
                          </div>
                          <div
                            className="superusers-action-btn"
                            onClick={() => setEditMode(null)}
                          >
                            <i className="fas fa-times"></i>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link to={`/${account.type}`}>
                            <div className="superusers-action-btn superusers-open">
                              <i className="fas fa-external-link-alt"></i>
                            </div>
                          </Link>
                          <div
                            className="superusers-action-btn superusers-edit"
                            onClick={() => startEdit(account)}
                          >
                            <i className="fas fa-pen-alt"></i>
                          </div>
                          <div className="superusers-action-btn superusers-delete">
                            <i className="fas fa-trash"></i>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div
                    className={`refresh-btn superusers-more-btn ${
                      expandedCard === account._id
                        ? "superusers-more-btn-up"
                        : ""
                    }`}
                    onClick={() => toggleCardExpansion(account._id)}
                  >
                    <i
                      className={`fas fa-arrow-${
                        expandedCard === account._id ? "up" : "down"
                      }`}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
