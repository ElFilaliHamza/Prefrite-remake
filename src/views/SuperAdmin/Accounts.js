import React, { useEffect, useState } from "react";
import "../../assets/css/Styles/Accounts.css"; // Import the CSS file
import { fetchAccounts } from "../../api/accountsAPI";
import config from '../../config/config';
import Loading from "../../components/Loading";


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accounts = fetchAccounts();
    setAccounts(accounts);
    setLoading(false);
  }, []);

  const categorizeAccounts = (accounts) => {
    const categories = {
      sellers: [],
      superSellers: [],
      admins: [],
      magasins: [],
      superadmins: [],
    };
    console.log("accounts");
    console.log(accounts);
    accounts.forEach((account) => {
      if (account.type === config.ROLE_NAME.SELLER  && account.superSeller) {
        categories.superSellers.push(account);
      } else if (account.type === config.ROLE_NAME.SELLER ) {
        categories.sellers.push(account);
      } else if (account.type === config.ROLE_NAME.ADMIN ) {
        categories.admins.push(account);
      } else if (account.type === config.ROLE_NAME.MAGASIN ) {
        categories.magasins.push(account);
      } else if (account.type === config.ROLE_NAME.SUPER_ADMIN) {
        categories.superadmins.push(account);
      }
    });

    return categories;
  };

  const categories = categorizeAccounts(accounts);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="accounts-container">
      <div className="create-account">
        <div className="account-card">
          <div className="account-icon">+</div>
          <div>Créer un compte</div>
        </div>
      </div>

      <div className="accounts-category">
        <h2>{config.ROLE_NAME_TEXT.SELLERS}:</h2>
        <div className="accounts-list">
          {categories.sellers.map((account) => (
            <div key={account._id} className="account-card">
              <div className="account-icon">📇</div>
              <div>{account.name}</div>
              <div className="account-action">⬇</div>
            </div>
          ))}
        </div>
      </div>

      <div className="accounts-category">
        <h2>{config.ROLE_NAME_TEXT.SUPER_SLLERS}:</h2>
        <div className="accounts-list">
          {categories.superSellers.map((account) => (
            <div key={account._id} className="account-card">
              <div className="account-icon">📇</div>
              <div>{account.name}</div>
              <div className="account-action">⬇</div>
            </div>
          ))}
        </div>
      </div>

      <div className="accounts-category">
        <h2>{config.ROLE_NAME_TEXT.ADMINS}:</h2>
        <div className="accounts-list">
          {categories.admins.map((account) => (
            <div key={account._id} className="account-card">
              <div className="account-icon">📇</div>
              <div>{account.name}</div>
              <div className="account-action">⬇</div>
            </div>
          ))}
        </div>
      </div>

      <div className="accounts-category">
        <h2>{config.ROLE_NAME_TEXT.MAGASINIERS}:</h2>
        <div className="accounts-list">
          {categories.magasins.map((account) => (
            <div key={account._id} className="account-card">
              <div className="account-icon">📇</div>
              <div>{account.name}</div>
              <div className="account-action">⬇</div>
            </div>
          ))}
        </div>
      </div>

      <div className="accounts-category">
        <h2>{config.ROLE_NAME_TEXT.SUPER_ADMINS}:</h2>
        <div className="accounts-list">
          {categories.superadmins.map((account) => (
            <div key={account._id} className="account-card">
              <div className="account-icon">📇</div>
              <div>{account.name}</div>
              <div className="account-action">⬇</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
