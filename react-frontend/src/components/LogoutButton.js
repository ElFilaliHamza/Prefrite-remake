import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../react-frontend/src/api/api';

const LogoutButton = () => {
  const history = useNavigate();

  const handleLogout = () => {
    api.post('/admin/session/logout', {}, { resolve: true })
      .then(response => {
        if (response.logged === false) {
          history.push('/');
        }
      });
  };

  return (
    <div className="Btn logoutBtn refresh-btn" onClick={handleLogout}>
      <i className="fas fa-sign-out" />
    </div>
  );
};

export default LogoutButton;
