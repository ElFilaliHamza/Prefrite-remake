import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { useSellerData } from "./SellerDataContext";
import LogoutButton from "./LogoutButton";
import ThemeToggleButton from "./ThemeToggleButton";
import RefreshButton from "./RefreshButton";
import config from "../config/config";
import "../assets/css/main.css";

const Header = ({ logout_route }) => {
  const [state] = useAppContext();
  const sessionRoute = state.sessionRoute || "";
  const sellerData = useSellerData();
  const title = sellerData?.sellerInfo?.name || "Loading...";

  return (
    <div className="user-nav">
      <div className="user-nav-item">
        {state.session ? (
          <Link className="user-name-title" to={config.Base_URL + sessionRoute}>
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
        <LogoutButton logout_route={logout_route} />
      </div>
    </div>
  );
};

export default Header;
