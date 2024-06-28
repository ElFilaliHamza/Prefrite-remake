import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";
import PathNav from "../../components/PathNav";
import { fetchSellersDebitData } from "../../api/sellersAPI";
// import "../../assets/css/Styles/SuperAdminDashboard.css"; // Ensure the path is correct

const DebitStatus = ({route}) => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();
  const navItems = [
    { path:`/${route}`, label: '', isHome: true , isCurr: false},
    { path: `/${route}/stats`, label: 'Etat', isHome: false , isCurr: true},
  ];

  useEffect(() => {
    const getSellersData = async () => {
      try {
        const endpoint_route = `/${route}/debit/getSellers`;
        const data = await fetchSellersDebitData(endpoint_route);
        setSellers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers data:", error);
        setLoading(false);
      }
    };

    getSellersData();
  }, [route]);

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
                        <Link to={`/${route}/debitStatus/${seller._id}`}>{seller.name}</Link>
                      </td>
                      <td className="td-link">
                        <Link to={`/${route}/debitStatus/${seller._id}`}>{seller.debit.toFixed(2)}</Link>
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
