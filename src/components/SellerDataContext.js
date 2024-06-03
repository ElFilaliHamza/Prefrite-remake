import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkSellerAccess, fetchSellerInfo } from '../api/sellersAPI';
import config from '../config/config';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { useAppContext } from './AppContext';
const SellerDataContext = createContext();

export const useSellerData = () => useContext(SellerDataContext);

export const SellerDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const getSellerData = async () => {
    try {
      const data = await fetchSellerInfo();
      setSellerData(data);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    } 
  };

  useEffect(() => {
    const fetchData = async () => {
        // console.log("state.sessionRoute")
        // console.log(state.sessionRoute)
        // console.log("config.BASE_ROUTE.SUPER_ADMIN")
        // console.log(config.BASE_ROUTE.SUPER_ADMIN)
      if (state.sessionRoute === config.BASE_ROUTE.SUPER_ADMIN) {
        const access = await checkSellerAccess();
        if (access) {
          await getSellerData();
        } else {
          navigate("/" + state.sessionRoute);
        }
      } else if (state.sessionRoute === config.BASE_ROUTE.SELLER) {
        await getSellerData();
      }
      setLoading(false);
    };

    fetchData();
  }, [state.sessionRoute, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SellerDataContext.Provider value={sellerData}>
      {children}
    </SellerDataContext.Provider>
  );
};
