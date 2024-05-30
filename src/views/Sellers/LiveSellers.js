import React, { useState, useEffect } from "react";
import { useAppContext } from "../../components/AppContext";
import "../../assets/css/Styles/LiveSellers.css";

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
    <div className="sellers-container">
      <h1>Statut Vendeurs</h1>
      <div className="sellers-grid">
        {sortedSellers.length ? (
          sortedSellers.map((seller, idx) => (
            <div
              key={seller._id + idx}
              className={`seller-card ${
                seller.connected ? "connected" : "disconnected"
              }`}
            >
              <div className="seller-card-header">
                <div className="superlive-info">
                  <div className="superlive-info-text">
                    <div className="superlive-status-small">
                      <i className="fas fa-wifi"></i>
                    </div>
                    <span>{new Date(seller.connectTime).toLocaleString()}</span>
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
              </div>
              <div className="seller-card-body">
                <h2>{seller.name}</h2>
              </div>
              <div
                className={`card-status-2 ${
                  seller.connected
                    ? "card-success-status"
                    : "card-danger-status"
                }`}
              >
                <i
                  className={`fas ${seller.connected ? "fa-wifi" : "fa-times"}`}
                ></i>
              </div>
            </div>
          ))
        ) : (
          <div>No sellers found</div>
        )}
      </div>
    </div>
  );
};

export default LiveSellers;
