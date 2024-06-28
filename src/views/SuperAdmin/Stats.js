import React, { useEffect, useState } from "react";
import { fetchSellersData } from "../../api/sellersAPI";
import {
  computeOverallStatistics,
  getSellersRevenue,
} from "../../tools/sellers";
import { calculateDaysInterval } from "../../tools/dates";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import PathNav from "../../components/PathNav";

const Stats = ({ startTime, endTime }) => {
  const [statistics, setStatistics] = useState({});
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
        setSellersStats(sellersStats);
        setStatistics(stats);
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
  };
  const navItems = [
    { path: '/superadmin', label: '', isHome: true, isCurr: true },
    // { path: '/superadmin/status', label: 'Etat' },
    // { path: '/superadmin/debitStatus', label: 'Vendeurs' },
  ];
  return (
    <div className="app-container">
            <PathNav navItems={navItems} />

      <div className="simple-container">
        <div>
          <div className="filter-container">
            <div>
              <span className="filter-title">Debut</span>
              <input type="date" className="filter-input" />
            </div>
            <div>
              <span className="filter-title">Fin</span>
              <input type="date" className="filter-input" />
            </div>
          </div>
          <div className="message-flex">
            <div className="time-interval-message">
              <div>Paiement Dernier</div>
            </div>
            <div className="interval-message">Affichage de status</div>
          </div>
        </div>
        <div className="super-flex-reverse">
          <div className="card-list">
            {showSellers && (
              <>
                {sellersStats.map((seller, idx) => (
                  <Link
                    key={seller.sellerInfo.name + idx}
                    className={`app-card modern-app-card ${seller.statut && seller.statut < 0
                      ? "seller-card-not-profit"
                      : "seller-card-profit"
                      }`}
                    to={`/superadmin/stats/sellerStats/${seller.sellerInfo._id}`}
                  >
                    <div className="card-badge">
                      <div>
                        <i
                          className={`fas ${seller.statut && seller.statut < 0
                            ? "fa-arrow-alt-to-bottom"
                            : "fa-arrow-alt-from-bottom"
                            }`}
                        ></i>
                        &nbsp;<span>{seller.statut.toFixed(2)}</span>
                      </div>
                    </div>
                    {seller.sellerInfo.name}
                  </Link>
                ))}
              </>
            )}
          </div>
          <div
            className="super-rapport super-rapport-loss"
            onClick={toggleShowSellers}
          >
            <div className="title-2">Rapport pour ce jour</div>
            <div className="super-rapport-item">
              <span>Statut</span>
              <span>{statistics.statut} DHS</span>
            </div>
            <div className="super-rapport-sep"></div>
            <div className="super-rapport-item">
              <span>Benefice</span>
              <span>{statistics.benefice} DHS</span>
            </div>
            <div className="super-rapport-sep"></div>
            <div className="super-rapport-item">
              <span>Revenu</span>
              <span>{statistics.revenu} DHS</span>
            </div>
            <div className="super-rapport-sep"></div>
            <div className="super-rapport-item">
              <span>My 3 Commission</span>
              <span>{statistics.commission} DHS</span>
            </div>
            <div className="super-rapport-sep"></div>
            <div className="super-rapport-item">
              <span>Charges</span>
              <span>{statistics.charges} DHS</span>
            </div>
            <div className="super-rapport-sep"></div>
          </div>
          <Link
            className="super-rapport super-debit-rapport super-rapport-loss"
            to="/superadmin/debitStatus"
          >
            <div className="super-rapport-item">
              <span>Credit</span>
              <span>{statistics.credit} DHS</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stats;
