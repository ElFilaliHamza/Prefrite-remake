import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/loginAPI';

const LogoutButton = ({ route }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(route)
      .then(response => {
        if (response.logged === false) {
          navigate('/login'); // Redirect to the login page after successful logout
        }else{
          navigate('/superadmin');
        }
        console.log('logout response:', response.logged);
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
