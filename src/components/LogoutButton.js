import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.post('/admin/session/logout', {}, { withCredentials: true }) // Ensure credentials are sent with the request
      .then(response => {
        if (response.data.logged === false) {
          navigate('/login'); // Redirect to the login page after successful logout
        }
        console.log('logout response:', response.data.logged);
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <div className="Btn logoutBtn refresh-btn" onClick={handleLogout}>
      <i className="fas fa-sign-out" />
    </div>
  );
};

export default LogoutButton;
