// SellerStats.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSellerData, updateSellerCharges } from "../../api/sellersAPI"; // Assume this is an API call function
import "./../../assets/css/Styles/SellerStats.css"; // Import the CSS file
import Loading from "../../components/Loading";
import { computeSellerStatistics } from "../../tools/sellers";

const SellerStats = () => {
  const { idSeller } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newCharges, setNewCharges] = useState(0);

  useEffect(() => {
    const getSellerData = async () => {
      try {
        const data = await fetchSellerData(idSeller);
        setSellerStats(computeSellerStatistics(data));
        setSeller(data);
        setNewCharges(data.charges); // Set initial value for charges
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setLoading(false);
      }
    };

    getSellerData();
  }, [idSeller]);

  const handleChargesEdit = async () => {
    try {
      await updateSellerCharges(idSeller, newCharges);
      setSellerStats((prevStats) => ({
        ...prevStats,
        charges: newCharges
      }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating charges:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!seller) {
    return <div>Seller not found</div>;
  }

  return (
    <div className="seller-stats-container">
      <header className="seller-stats-header">
        <div className="seller-stats-title">
          <h2>{seller.name}</h2>
        </div>
      </header>
      <div className="seller-stats-body">
        <div className="seller-stats-item">
          <span className="seller-stats-label">Statut:</span>
          <span className={`seller-stats-value ${sellerStats.statut < 0 ? 'negative-value' : 'positive-value'}`}>
            {sellerStats.statut} DHS
          </span>
        </div>
        <div className="seller-stats-item">
          <span className="seller-stats-label">Benefice:</span>
          <span className={`seller-stats-value ${sellerStats.benefice < 0 ? 'negative-value' : 'positive-value'}`}>
            {sellerStats.benefice} DHS
          </span>
        </div>
        <div className="seller-stats-item">
          <span className="seller-stats-label">Revenu:</span>
          <span className={`seller-stats-value ${sellerStats.revenu < 0 ? 'negative-value' : 'positive-value'}`}>
            {sellerStats.revenu} DHS
          </span>
        </div>
        <div className="seller-stats-item">
          <span className="seller-stats-label">My 2 Commission:</span>
          <span className="seller-stats-value neutral-value">
            {sellerStats.commission} DHS
          </span>
        </div>
        <div className="seller-stats-item">
          <span className="seller-stats-label">Charges:</span>
          <span className="seller-stats-value neutral-value">
            {editMode ? (
              <>
                <input
                  type="number"
                  value={newCharges}
                  onChange={(e) => setNewCharges(e.target.value)}
                />
                <button onClick={handleChargesEdit}>✔</button>
              </>
            ) : (
              <>
                {sellerStats.charges} DHS
                <button onClick={() => setEditMode(true)}>✏️</button>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerStats;
