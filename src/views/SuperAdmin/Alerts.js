import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlerts, fetchAlertsCount } from '../../api/alertsAPI';
import '../../assets/css/Styles/Alerts.css'; // Ensure this file exists with the required styles
import { usePrintComponent } from '../../tools/printComponent';


const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [handlePrint, PrintComponent] = usePrintComponent();

  const [endAlerts, setEndAlerts] = useState(false);
  const [skip, setSkip] = useState(0);
  // const [alertsCount, setAlertsCount] = useState(0);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    fetchInitialAlerts();
    // fetchAlertsCount().then(setAlertsCount).catch(console.error);
  }, []);


  const fetchInitialAlerts = async () => {
    try {
      const data = await fetchAlerts(0);
      setAlerts(data.alerts);
      setEndAlerts(data.endAlerts);
      setSkip(data.alerts.length);
    } catch (error) {
      console.error('Error fetching initial alerts:', error);
    }
  };

  const fetchMoreAlerts = async () => {
    try {
      const data = await fetchAlerts(skip);
      setAlerts((prevAlerts) => [...prevAlerts, ...data.alerts]);
      setEndAlerts(data.endAlerts);
      setSkip(skip + data.alerts.length);
    } catch (error) {
      console.error('Error fetching more alerts:', error);
    }
  };

  return (
    <div className="alerts-container">
      <button className="print-btn" onClick={handlePrint}>Imprimer</button>

      <PrintComponent>
        <h1>Alerts de quantités</h1>
        <div ref={componentRef}>
          <table className="alerts-table" id='printAlerts'>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Qt Stocke</th>
                <th>Qt Alerte</th>
                <th>Commission</th>
                <th>Dépassé</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr className='alert-line' key={alert._id} onClick={() => navigate(`/superadmin/article/${alert._id}`)}>
                  <td>{alert.name}</td>
                  <td>{alert.qtStocke}</td>
                  <td>{alert.qtAlerte}</td>
                  <td>0</td> {/* Placeholder for commission */}
                  <td>{alert.qtStocke < alert.qtAlerte ? 'Oui' : 'Non'}</td> {/* Dépassé logic */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PrintComponent>
      {!endAlerts && (
        <button className="load-more-btn" onClick={fetchMoreAlerts}>
          Afficher Plus
        </button>
      )}
    </div>
  );
};

export default Alerts;
