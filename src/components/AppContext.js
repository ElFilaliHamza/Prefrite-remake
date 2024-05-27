import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loading from './Loading';
import '../assets/css/main.css';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    session: null,
    netError: false,
    loading: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.post('/admin/session');
        console.log("AppContext");
        console.log(response.data);
        if (response.data.logged) {
          setState((prevState) => ({ ...prevState, session: response.data, loading: false }));
        } else {
          setState((prevState) => ({ ...prevState, loading: false }));
          navigate('/login');
        }
      } catch (error) {
        setState((prevState) => ({ ...prevState, netError: true, loading: false }));
      }
    };

    checkSession();
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
