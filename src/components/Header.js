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
  // console.log("role : "+state.session);
  // console.log(state.session);
  return (
    <div className="user-nav">
      <div className="user-nav-item">
      {state.session ? (
          <Link className="user-name-title" to={config.Base_URL+state.session.route}>{ config.getRouteName(state.session.route)}</Link>
        ) : (
          <Link className="user-name-title" to={config.Base_URL}> Prefrite </Link>
        )
      }
      </div>
        
      <div className="user-nav-item btn-group-around">
        {state.session && state.session.route === config.BASE_ROUTE && (
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
