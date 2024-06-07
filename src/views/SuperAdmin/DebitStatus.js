import React, { useEffect, useState } from "react";
import { fetchSellersDebitData } from "../../api/sellersAPI";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";
import PathNav from "../../components/PathNav";
// import "../../assets/css/Styles/SuperAdminDashboard.css"; // Ensure the path is correct

const DebitStatus = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();
  const navItems = [
    { path: '/superadmin', label: '', isHome: true , isCurr: false},
    { path: '/superadmin/stats', label: 'Etat', isHome: false , isCurr: true},
  ];

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
    <div className="app-container">
      <PathNav navItems={navItems} />

      <div className="simple-container">
        <div>
          <button className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</button>
          <div style={{ margin: '20px' }}>
            <div className="printable-title">Credit par Vendeurs</div>
            <div className="time-interval-message">{currentDate}</div>
            <PrintComponent>
              <table className="table shadow">
                <thead className="thead-dark">
                  <tr>
                    <th>Vendeur</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller) => (
                    <tr key={seller._id}>
                      <td className="td-link">
                        <Link to={`/superadmin/debitStatus/${seller._id}`}>{seller.name}</Link>
                      </td>
                      <td className="td-link">
                        <Link to={`/superadmin/debitStatus/${seller._id}`}>{seller.debit.toFixed(2)}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintComponent>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DebitStatus;
