import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkSession } from "../api/loginAPI"; // Ensure this is correctly imported
import Loading from "./Loading";
import "../assets/css/main.css";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    session: null,
    netError: false,
    loading: true,
    sessionRoute: null,
  });

  const checkCurrSession = async () => {
    try {
      const login_data = await checkSession();
      if (login_data.logged) {
        const sessionRoute = login_data.route;
        console.log("login_data.route");
        console.log(sessionRoute);
        setState((prevState) => ({
          ...prevState,
          session: login_data,
          sessionRoute,
          loading: false,
        }));
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
        navigate("/login");
      }
    } catch (error) {
      console.log(error)
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
