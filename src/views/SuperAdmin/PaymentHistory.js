import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { fetchPayementHistory } from "../../api/stats";
import { getTodayDate } from "../../tools/dates";
import { formatNumber } from "../../tools/global";
import { usePrintComponent } from "../../tools/printComponent";

const PaymentHistory = () => {
  const [handlePrint, PrintComponent] = usePrintComponent();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [startTime, setStartDate] = useState(getTodayDate());
  const [endTime, setEndDate] = useState(getTodayDate());

  const fetchHistoryData = async (startDate, endDate) => {
    try {
      const data = await fetchPayementHistory(startDate, endDate);
      setHistoryData(data.sellers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchHistoryData(startTime, endTime);
    setLoading(false);
  }, [startTime, endTime]);

  const handleDateChange = (e) => {
    setStartDate(e.target.value);
    setEndDate(e.target.value);
    fetchHistoryData(startTime, endTime);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <div className="simple-container">
        <div>
          <div className="filter-container">
            <div>
              <span className="filter-title">Jour</span>
              <input
                type="date"
                className="filter-input"
                value={startTime}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</div>

          <PrintComponent>
            <div style={{ margin: '20px' }}>
              <div className="message-flex">
                <div className="time-interval-message">{startTime}</div>
                <div className="interval-message">Historique d'Encaissement</div>
              </div>
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Vendeur</th>
                    <th>Payé</th>
                    <th>Credit Vendeur</th>
                    <th>Stocke Voiture</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((seller, index) => (
                    <tr key={index}>
                      <td>{seller.name}</td>
                      <td>{formatNumber(seller.payment)} DHS</td>
                      <td className="debit-td">{formatNumber(seller.debit)} DHS</td>
                      <td>{seller.totalStock} DHS</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total: </td>
                    <td>0 DHS</td>
                    <td className="debit-td">0 DHS</td>
                    <td>0 DHS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PrintComponent>

        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
