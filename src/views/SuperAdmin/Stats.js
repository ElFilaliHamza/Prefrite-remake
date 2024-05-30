import React, { useEffect, useState } from "react";
import { fetchSellersData } from "../../api/sellersAPI";
import {
  computeOverallStatistics,
  getSellersRevenue,
} from "../../tools/sellers";
import { calculateDaysInterval } from "../../tools/dates";
import "./../../assets/css/Styles/Stats.css"; // Import the CSS file
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

const Stats = ({ startTime, endTime }) => {
  const [statistics, setStatistics] = useState({});
  const [sellers, setSellers] = useState([]);
  const [sellersStats, setSellersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellers, setShowSellers] = useState(false);

  useEffect(() => {
    const getSellersData = async () => {
      try {
        const sellersData = await fetchSellersData();
        const stats = computeOverallStatistics(
          sellersData.sellers,
          calculateDaysInterval(startTime, endTime)
        );
        const sellersStats = getSellersRevenue(sellersData.sellers);
        console.log("sellersStats");
        console.log(sellersStats);
        setSellersStats(sellersStats);
        setStatistics(stats);
        setSellers(sellersData.sellers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers data:", error);
        setLoading(false);
      }
    };

    getSellersData();
  }, [startTime, endTime]);

  if (loading) {
    return <Loading />;
  }

  const toggleShowSellers = () => {
    setShowSellers(!showSellers);
    setSellersStats(sellersStats);
  };

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Rapport pour ce jour</h2>
        <Link to={`/superadmin/debitStatus`}>
          <div className="stats-credit">
            <span className="">Credit</span>
            <span className="">{statistics.credit} DHS</span>
          </div>
        </Link>
      </div>
      <div className="stats-body" onClick={toggleShowSellers}>
        <div className="stats-item">
          <span className="stats-label">Statut</span>
          <span className="stats-value">{statistics.statut} DHS</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">Benefice</span>
          <span className="stats-value">{statistics.benefice} DHS</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">Revenu</span>
          <span className="stats-value">{statistics.revenu} DHS</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">My 3 Commission</span>
          <span className="stats-value">{statistics.commission} DHS</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">Charges</span>
          <span className="stats-value">{statistics.charges} DHS</span>
        </div>
      </div>
      {showSellers && (
        <div className="sellers-container">
          {sellersStats.map((seller, idx) => (
            <div
                key={seller.sellerInfo.name + idx}
                className={`seller-item ${
                  seller.statut && seller.statut < 0 ? "negative" : "positive"
                }`}
              >
                  <Link to={`/superadmin/stats/SellerStats/${seller.sellerInfo._id}`}>
                <span className="seller-profit">
                  {seller.statut && seller.statut
                    ? seller.statut.toFixed(2)
                    : 0}
                </span>
                <span className="seller-name">{seller.sellerInfo.name}</span>
            </Link>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stats;
