import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAdminAccess } from "../../api/sellersAPI";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const MagazinContext = createContext();

export const useMagazinData = () => useContext(MagazinContext);

export const MagazinDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [adminData, setMagazinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const getMagazinData = async () => {
    try {
      // const data = await fetchSellerInfo();
      setMagazinData(null);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (state.session.route === config.BASE_ROUTE.SUPER_ADMIN) {
        const access = await checkAdminAccess();
        if (access.ok) {
          await getMagazinData();
        } else {
          navigate("/" + state.session.route);
        }
      } else {
        const session_data = await checkRouteSession(config.BASE_ROUTE.MAGASIN);
        if (session_data.logged) {
          await getMagazinData();
        } else {
          navigate("/login");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [state.session.route, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <MagazinContext.Provider value={adminData}>{children}</MagazinContext.Provider>
  );
};
