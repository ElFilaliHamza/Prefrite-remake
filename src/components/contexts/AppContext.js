import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
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

  const checkCurrSession = useCallback(async () => {
    try {
      const login_data = await checkSession();
      if (login_data.logged) {
        setState((prevState) => ({
          ...prevState,
          session: login_data,
          loading: false,
        }));

        const currentPath = location.pathname;
        const baseRoute = allowedRoutes[login_data.route];

        if (login_data.route !== 'superadmin' && !currentPath.startsWith(baseRoute)) {
          navigate(`/${login_data.route}`);
        }
        else {
          if (currentPath === '/login') {
            navigate(`/${login_data.route}`);
          }
        }
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
        navigate("/login");
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setState((prevState) => ({
        ...prevState,
        netError: true,
        loading: false,
      }));
    }
  }, [navigate, location.pathname, allowedRoutes]);

  useEffect(() => {
    checkCurrSession();
  }, [checkCurrSession]);

  const contextValue = useMemo(() => [state, setState], [state]);

  if (state.loading) {
    return <Loading />;
  }

  if (state.netError) {
    return <div>Connection Error</div>;
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
