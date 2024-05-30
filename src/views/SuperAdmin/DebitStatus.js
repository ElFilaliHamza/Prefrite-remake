import React, { useEffect, useState } from "react";
import { fetchSellersDebitData } from "../../api/sellersAPI";
import { Link } from "react-router-dom";
import "./DebitStatus.css"; // Import the CSS file
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";

const DebitStatus = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();

  useEffect(() => {
    const getSellersData = async () => {
      try {
        const data = await fetchSellersDebitData();
        setSellers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers data:", error);
        setLoading(false);
      }
    };

    getSellersData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const currentDate = new Date().toLocaleString();

  return (
    <div className="debit-status-container">
      <header className="debit-status-header">
        <div className="debit-status-nav">
          <button>Etat</button>
        </div>
      </header>

      <div className="debit-status-title">
        <button className="print-button" onClick={handlePrint}>
          Imprimer
        </button>
      </div>
      <PrintComponent>
        <h2>CREDIT PAR VENDEURS</h2>
        <div className="debit-status-date">{currentDate}</div>
        <table className="debit-status-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td>
                  <Link to={`/superadmin/debitStatus/${seller._id}`}>
                    {seller.name}
                  </Link>
                </td>
                <td>
                  <Link to={`/superadmin/debitStatus/${seller._id}`}>
                    {seller.debit.toFixed(2)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintComponent>
    </div>
  );
};

export default DebitStatus;
