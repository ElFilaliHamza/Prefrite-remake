import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { checkAccess, fetchSellerInfo } from "../../api/sellersAPI";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";
import { useAppContext } from "./AppContext";
import { checkRouteSession } from "../../api/loginAPI";

const SellerContext = createContext();

export const useSellerData = () => useContext(SellerContext);

export const SellerDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState(null);
  const [categories, setCategories] = useState(null);
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAppContext();

  const getSellerData = useCallback(async () => {
    try {
      const data = await fetchSellerInfo(); // Fetch seller data using the sellerId
      setSellerData(data);
      setCategories(data.artsNcats.cats);
      setArticles(data.artsNcats.arts);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // if (state.session.route === config.BASE_ROUTE.SUPER_ADMIN) {
      //   const access = await checkAccess({type: config.BASE_ROUTE.SELLER,_id: sellerId});
      //   if (access.ok) {
      //     await getSellerData(); 
      //   } else {
      //     navigate("/" + state.session.route);
      //   }
      // } else {
      const session_data = await checkRouteSession(config.BASE_ROUTE.SELLER);
      if (session_data.logged) {
        await getSellerData();
      } else {
        if (state.session) {
          navigate("/" + state.session.route);
        } else {
          navigate("/login");
        }
      }
      // }
      setLoading(false);
    };

    fetchData();
  }, [getSellerData, navigate, state.session]); // Add necessary dependencies

  const contextValue = useMemo(() => ({
    categories,
    articles,
    sellerData
  }), [categories, articles, sellerData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SellerContext.Provider value={contextValue}>
      {children}
    </SellerContext.Provider>
  );
};
