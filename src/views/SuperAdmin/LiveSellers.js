import React, { useState, useEffect } from "react";
import { useAppContext } from "../../components/contexts/AppContext";

const LiveSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useAppContext();
  const socketRef = state.socket;

  useEffect(() => {
    const handleSellersUpdate = (data) => {
      setSellers(data.sellers);
      setLoading(false);
    };

    const handleSellersConnection = (seller) => {
      const connectedSeller = seller.sellerInfo;
      setSellers((prevSellers) => {
        const index = prevSellers.findIndex(
          (s) => s._id === connectedSeller._id
        );
        if (index !== -1) {
          const updatedSellers = [...prevSellers];
          updatedSellers[index] = {
            ...updatedSellers[index],
            connected: connectedSeller.connected,
            connectTime: new Date(),
            disconnectTime: new Date(),
          };
          return updatedSellers;
        } else {
          return [...prevSellers, connectedSeller];
        }
      });
    };

    if (socketRef) {
      socketRef.on("all_sellers", handleSellersUpdate);
      socketRef.on("seller_connected", handleSellersConnection);
      socketRef.on("seller_disconnected", handleSellersConnection);
    }

    return () => {
      if (socketRef) {
        socketRef.off("all_sellers", handleSellersUpdate);
        socketRef.off("seller_connected", handleSellersConnection);
        socketRef.off("seller_disconnected", handleSellersConnection);
      }
    };
  }, [socketRef]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedSellers = sellers.sort((a, b) => (b.connected ? 1 : -1));

  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="path-nav">
          <a className="path-btn path-btn-current" href="/superadmin">
            <i className="fas fa-home"></i>
          </a>
        </div>
        <div className="title-2">Statut Vendeurs</div>
        <div className="card-list">
          {sortedSellers.length ? (
            sortedSellers.map((seller, idx) => (
              <div key={seller._id + idx} className="app-card">
                <div className="superlive-info">
                  <div className="superlive-info-text">
                    <div className="superlive-status-small">
                      <i className="fas fa-wifi"></i>
                    </div>
                    <span>
                      {new Date(seller.connectTime).toLocaleString()}
                    </span>
                  </div>
                  {!seller.connected && (
                    <div className="superlive-info-text">
                      <div className="superlive-status-small">
                        <i className="fas fa-times"></i>
                      </div>
                      <span>
                        {new Date(seller.disconnectTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div>{seller.name}</div>
                <div
                  className={`card-status ${
                    seller.connected
                      ? "card-success-status"
                      : "card-danger-status"
                  }`}
                >
                  <i
                    className={`fas ${
                      seller.connected ? "fa-wifi" : "fa-times"
                    }`}
                  ></i>
                </div>
              </div>
            ))
          ) : (
            <div>No sellers found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSellers;
