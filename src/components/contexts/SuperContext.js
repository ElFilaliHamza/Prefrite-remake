import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    console.log("SuperContext");
    const fetchData = async () => {
      if (!state.session.route) {
        const session_data = await checkRouteSession(
          config.BASE_ROUTE.SUPER_ADMIN
        );
        console.log("checkRouteSession SUPER_ADMIN:::");
        console.log(session_data);
        if (session_data.logged) {
          navigate(`/${config.BASE_ROUTE.SUPER_ADMIN}`);
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
    <SuperContext.Provider value={superData}>{children}</SuperContext.Provider>
  );
};
