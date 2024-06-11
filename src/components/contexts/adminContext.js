import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAdminAccess, fetchSellerInfo } from "../../api/sellersAPI";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const AdminContext = createContext();

export const useAdminData = () => useContext(AdminContext);

export const AdminDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const getAdminData = async () => {
    try {
      // const data = await fetchSellerInfo();
      setAdminData(null);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (state.session.route === config.BASE_ROUTE.SUPER_ADMIN) {
        const access = await checkAdminAccess();
        if (access.ok) {
          await getAdminData();
        } else {
          navigate("/" + state.session.route);
        }
      } else {
        const session_data = await checkRouteSession(config.BASE_ROUTE.ADMIN);
        if (session_data.logged) {
          await getAdminData();
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
    <AdminContext.Provider value={adminData}>{children}</AdminContext.Provider>
  );
};
