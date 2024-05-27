import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';
import LogoutButton from './LogoutButton';
import ThemeToggleButton from './ThemeToggleButton';
import RefreshButton from './RefreshButton';
import config from '../config/config';
import '../assets/css/main.css';


const Header = () => {
  const [state] = useAppContext();

  return (
    <div className="user-nav">
      <div className="user-nav-item">
        <Link className="user-name-title" to={config.baseUrl}>Admin</Link>
      </div>
      <div className="user-nav-item btn-group-around">
        {state.session && state.session.role === 'superadmin' && (
          <Link className="flat-btn btn-blue" to="/stats">Stats</Link>
        )}
        <RefreshButton />
        <ThemeToggleButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;
