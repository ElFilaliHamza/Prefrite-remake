// CreateAccount.js
import React, { useState } from "react";
import "../../assets/css/Styles/CreateAccount.css"; // Import the CSS file
import api from "../../api/api";
import config from "../../config/config";
import { createAccount } from "../../api/accountsAPI";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(config.ROLE_NAME.SELLER);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [charges, setCharges] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const account = {
        type,
        name,
        username,
        password,
        charges: type === config.ROLE_NAME.SELLER ? charges : undefined,
      };

      const response = await createAccount(account);
      console.log("response");
      console.log(response);
      if (response.ok) {
        navigate("/superadmin/accounts");
      } else {
        if (response.error) {
          
        alert(response.errorMessage);
        }
      }
    } catch (error) {
      alert("Erreur lors de la création du compte");
      console.log(error);
    }
  };

  return (
    <div className="create-account-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className="create-account-form">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value={`${config.ROLE_NAME.SELLER}`}>
            {config.ROLE_NAME_TEXT.SELLER}
          </option>
          <option value={`${config.ROLE_NAME.MAGASIN}`}>
            {config.ROLE_NAME_TEXT.MAGASINIER}
          </option>
          <option value={`${config.ROLE_NAME.ADMIN}`}>
            {config.ROLE_NAME_TEXT.ADMIN}
          </option>
          <option value={`${config.ROLE_NAME.SUPER_SELLER}`}>
            {config.ROLE_NAME_TEXT.SUPER_SELLER}
          </option>
        </select>
        <input
          type="text"
          placeholder="Nom et Prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="fas fa-eye" onClick={togglePasswordVisibility}></i>
        </div>
        {type === config.ROLE_NAME.SELLER && (
          <input
            type="number"
            placeholder="Charges"
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            required
          />
        )}
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateAccount;

const togglePasswordVisibility = () => {
  const passwordField = document.querySelector(".password-container input");
  const passwordIcon = document.querySelector(".password-container i");
  if (passwordField.type === "password") {
    passwordField.type = "text";
    passwordIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordField.type = "password";
    passwordIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
};
