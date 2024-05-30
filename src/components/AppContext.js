// AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { checkSession } from '../api/loginAPI';
import Loading from './Loading';
import '../assets/css/main.css';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    session: null,
    netError: false,
    loading: true,
    socket: null,
  });

  useEffect(() => {
    const checkCurrSession = async () => {
      try {
        // console.log("Session");
        const login_data = await checkSession(); // Ensure this matches your backend session check endpoint
        // console.log("CheckSession");
        // console.log(login_data);
        if (login_data.logged) {
          setState((prevState) => ({ ...prevState, session: login_data, loading: false }));
        } else {
          setState((prevState) => ({ ...prevState, loading: false }));
          navigate('/login');
        }
      } catch (error) {
        setState((prevState) => ({ ...prevState, netError: true, loading: false }));
      }
    };

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
