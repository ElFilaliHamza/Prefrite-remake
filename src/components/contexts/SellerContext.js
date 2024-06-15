import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkSellerAccess, fetchSellerInfo } from "../../api/sellersAPI";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const SellerContext = createContext();

export const useSellerData = () => useContext(SellerContext);

export const SellerDataProvider = ({ children }) => {
  const { sellerId } = useParams(); // Get the sellerId from the URL parameters
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const getSellerData = useCallback(async (id) => {
    try {
      const data = await fetchSellerInfo(id); // Fetch seller data using the sellerId
      setSellerData(data);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (state.session.route === config.BASE_ROUTE.SUPER_ADMIN) {
        const access = await checkSellerAccess();
        if (access.ok) {
          await getSellerData(sellerId); // Pass sellerId to getSellerData
        } else {
          navigate("/" + state.session.route);
        }
      } else {
        const session_data = await checkRouteSession(config.BASE_ROUTE.SELLER);
        if (session_data.logged) {
          await getSellerData(sellerId); // Pass sellerId to getSellerData
        } else {
          navigate("/login");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [getSellerData, sellerId, navigate, state.session.route]); // Add necessary dependencies

  if (loading) {
    return <Loading />;
  }

  return (
    <SellerContext.Provider value={sellerData}>
      {children}
    </SellerContext.Provider>
  );
};
