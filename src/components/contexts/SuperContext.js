import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const SuperContext = createContext();

export const useSuperData = () => useContext(SuperContext);

export const SuperDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [superData, setSuperData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const fetchSessionData = useCallback(async () => {
    if (!state.session.route) {
      try {
        const session_data = await checkRouteSession(config.BASE_ROUTE.SUPER_ADMIN);
        console.log("checkRouteSession SUPER_ADMIN:::", session_data);
        if (session_data.logged) {
          navigate(`/${config.BASE_ROUTE.SUPER_ADMIN}`);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking route session:", error);
        navigate("/login");
      }
    }
    setLoading(false);
  }, [state.session.route, navigate]);

  useEffect(() => {
    console.log("SuperContext");
    fetchSessionData();
  }, [fetchSessionData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SuperContext.Provider value={superData}>
      {children}
    </SuperContext.Provider>
  );
};
