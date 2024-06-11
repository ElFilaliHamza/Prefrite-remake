import React from "react";
import { useAppContext } from "../components/contexts/AppContext";

const PageNotFound = () => {
  const [state, setState] = useAppContext();

  return (
    <>
      <div className="app-container">
        <div className="user-home">
          
          <div className="simple-container">
            
            <div className="notfound">
              <div className="notfound-404">
                <h1>404</h1>
              </div>
              <h2>Page n'est pas trouvé</h2>
              <p>
                <a href="/">Accueil</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
