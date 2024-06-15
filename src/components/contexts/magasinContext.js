import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { checkAdminAccess } from "../../api/sellersAPI";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const MagasinContext = createContext();

export const useMagasinData = () => useContext(MagasinContext);

export const MagasinDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [adminData, setMagasinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state] = useAppContext();

  const getMagasinData = useCallback(async () => {
    try {
      // const data = await fetchSellerInfo();
      setMagasinData(null);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state.session.route === config.BASE_ROUTE.SUPER_ADMIN) {
          const access = await checkAdminAccess();
          if (access.ok) {
            await getMagasinData();
          } else {
            navigate("/" + state.session.route);
          }
        } else {
          const session_data = await checkRouteSession(config.BASE_ROUTE.MAGASIN);
          if (session_data.logged) {
            await getMagasinData();
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.session.route, navigate, getMagasinData]);

  const contextValue = useMemo(() => ({
    adminData,
  }), [adminData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <MagasinContext.Provider value={contextValue}>
      {children}
    </MagasinContext.Provider>
  );
};
