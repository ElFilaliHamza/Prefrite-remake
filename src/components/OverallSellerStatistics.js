import React, { useEffect, useState } from "react";
import { fetchSellersData } from "../api/sellersAPI";
import { computeOverallStatistics } from "../tools/sellers";
import { calculateDaysInterval } from "../tools/dates";

const OverallSellerStatistics = ({ startTime, endTime }) => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSellersData = async () => {
      try {
        const sellersData = await fetchSellersData();
        // console.log("sellersData");
        // console.log(sellersData.sellers);
        const stats = computeOverallStatistics(sellersData.sellers, calculateDaysInterval(startTime, endTime));
        // console.log("stats");
        // console.log(stats);
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Overall Seller Statistics</h2>
      <p>Statut: {statistics.statut} DHS</p>
      <p>Benefice: {statistics.benefice} DHS</p>
      <p>Revenu: {statistics.revenu} DHS</p>
      <p>My 3 Commission: {statistics.commission} DHS</p>
      <p>Charges: {statistics.charges} DHS</p>
      <p>Credit : {statistics.credit} DHS</p>
    </div>
  );
};

export default OverallSellerStatistics;
