import React from "react";
import "../assets/css/main.css";
import Header from "../components/Header";
import { useAppContext } from "../components/contexts/AppContext";
const PageNotFound = () => {
  const [state , setState] = useAppContext();

  return (
    <>
      <Header title={`${state.session.route}`} logout_route={`${state.session.route}`} />
      <div>Page Not Found</div>;
    </>
  );
};

export default PageNotFound;
