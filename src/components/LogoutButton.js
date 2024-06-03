import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/loginAPI";
import { useAppContext } from "./AppContext";
import config from "../config/config";

const LogoutButton = ({ logout_route }) => {
  const navigate = useNavigate();
  const [state, setState] = useAppContext();
  const sessionRoute = state.sessionRoute;

  const handleLogout = async () => {
    try {
      // if (logout_route === config.BASE_ROUTE.SUPER_ADMIN){
      const response = await logout(logout_route);
      // }
      // if (logout_route) {
      //   const response = await logout(logout_route);
      //   console.log("logout_route");
      //   console.log(logout_route);
      //   console.log(state.sessionRoute);
      //   if (
      //     state.sessionRoute === logout_route &&
      //     state.sessionRoute === config.BASE_ROUTE.SELLER
      //   ) {
      //     navigate(`/login`);
      //     if (response || response.logged === false) {
      //       // Clear session data from context
      //       setState((prevState) => ({
      //         ...prevState,
      //         session: null,
      //         sessionRoute: null,
      //       }));
      //     }
      //   } else {
      //     console.log("navigate "+logout_route)
      //     navigate(`/${state.sessionRoute}`); // Redirect to the sessionRoute page after successful logout
      //   }
      // } else {
      //   // const response = await logout(sessionRoute);
      //   // console
      //   navigate("/login"); // Redirect to the login page after successful logout
      // }
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
