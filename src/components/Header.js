import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";
import LogoutButton from "./LogoutButton";
import ThemeToggleButton from "./ThemeToggleButton";
import RefreshButton from "./RefreshButton";
import config from "../config/config";
import "../assets/css/main.css";

const Header = ({ title, logoutRoute }) => {
  const [state] = useAppContext();
  const sessionType = state.session?.route || "";

  return (
    <div className="user-nav">
      <div className="user-nav-item">
        {state.session ? (
          <Link
            className="user-name-title"
            to={config.Base_URL + state.session.route}
          >
            {title}
          </Link>
        ) : (
          <Link className="user-name-title" to={config.Base_URL}>
            Prefrite
          </Link>
        )}
      </div>

      <div className="user-nav-item btn-group-around">
        {state.session && state.session.route === config.BASE_ROUTE && (
          <Link className="flat-btn btn-blue" to="/stats">
            Stats
          </Link>
        )}
        <RefreshButton />
        <ThemeToggleButton />
        <LogoutButton route={logoutRoute} />
      </div>
    </div>
  );
};

export default Header;
