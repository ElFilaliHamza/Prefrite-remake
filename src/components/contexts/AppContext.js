import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSession } from "../../api/loginAPI";
import Loading from "../Loading";
import config from "../../config/config";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const allowedRoutes = config.ALLOWED_ROUTES;
  const [state, setState] = useState({
    session: null,
    netError: false,
    loading: true,
    socket: null,
  });

  const checkCurrSession = async () => {
    try {
      const login_data = await checkSession();
      if (login_data.logged) {
        setState((prevState) => ({
          ...prevState,
          session: login_data,
          loading: false,
        }));

        const currentPath = location.pathname;

        // Define the allowed routes based on user roles
        const baseRoute = allowedRoutes[login_data.route];

        // Check if the current path starts with the allowed base route
        if (login_data.route !== 'superadmin' && !currentPath.startsWith(baseRoute)) {
          navigate(`/${login_data.route}`);
        } else {
          navigate(currentPath); // or redirect to a default route if preferred
        }
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setState((prevState) => ({
        ...prevState,
        netError: true,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    checkCurrSession();
  }, [navigate]);

  if (state.loading) {
    return <Loading />;
  }

  if (state.netError) {
    return <div>Connection Error</div>;
  }

  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
