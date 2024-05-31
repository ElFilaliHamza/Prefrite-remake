import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkSession } from "../api/loginAPI";
import Loading from "./Loading";
import "../assets/css/main.css";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    session: null,
    netError: false,
    loading: true,
    socket: null,
    sessionType: null, // Add sessionType
  });

  const checkCurrSession = async () => {
    try {
      const login_data = await checkSession();
      if (login_data.logged) {
        const sessionType = login_data.superadmin
          ? "superadmin"
          : login_data.sellerId
          ? "seller"
          : null;
        setState((prevState) => ({
          ...prevState,
          session: login_data,
          sessionType,
          loading: false,
        }));
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
        navigate("/login");
      }
    } catch (error) {
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
    return <div>Erreur de connexion</div>;
  }

  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
