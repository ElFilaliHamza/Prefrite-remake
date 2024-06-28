import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/loginAPI";
import { useAppContext } from "../contexts/AppContext";
import config from "../../config/config";
import { checkSession } from "../../api/loginAPI";

const LogoutButton = ({ logout_route }) => {
  const navigate = useNavigate();
  const [state, setState] = useAppContext();

  const handleLogout = async () => {
    try {
      // if (logout_route === config.BASE_ROUTE.SUPER_ADMIN){
      const logout_data = await logout(logout_route);
      const login_data = await checkSession();
      console.log("logout_data");
      console.log(logout_data);
      if (login_data.logged && !logout_data){
        console.log("login_data.route in logout")
        console.log(login_data.route)
        navigate(`/${login_data.route}`);
      }
      else if (!logout_data.logged){
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="Btn logoutBtn refresh-btn" onClick={handleLogout}>
      <i className="fas fa-sign-out" />
    </div>
  );
};

export default LogoutButton;
