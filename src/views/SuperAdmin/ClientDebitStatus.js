import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchClientsDebitData } from '../../api/clientsAPI';
import './ClientDebitStatus.css'; // Import the CSS file
import Loading from '../../components/Loading';
import { usePrintComponent } from '../../tools/printComponent';

const ClientDebitStatus = () => {
  const { idSeller } = useParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();

  useEffect(() => {
    const getClientsData = async () => {
      try {
        const data = await fetchClientsDebitData(idSeller);
        console.log("getClientsData")
        console.log(data)
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients data:', error);
        setLoading(false);
      }
    };

    getClientsData();
  }, [idSeller]);

  if (loading) {
    return <Loading />;
  }

  const currentDate = new Date().toLocaleString();
  
  

  return (
    <div className="client-debit-status-container">
      <header className="client-debit-status-header">
        <div className="client-debit-status-nav">
          <button onClick={() => window.history.back()}>Retour</button>
        </div>
      </header>
      <div className="client-debit-status-title">
        <button className="print-button" onClick={handlePrint}>Imprimer</button>
      </div>
      <PrintComponent>
        <h2>CREDIT PAR CLIENTS</h2>
      <div className="client-debit-status-date">{currentDate}</div>
      <table className="client-debit-status-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td><Link to={`/superadmin/invoiceDebitStatus/${client._id}`}>{client.name}</Link></td>
              <td><Link to={`/superadmin/invoiceDebitStatus/${client._id}`}>{client.debit.toFixed(2)}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      </PrintComponent>
    </div>
  );
};

export default ClientDebitStatus;
