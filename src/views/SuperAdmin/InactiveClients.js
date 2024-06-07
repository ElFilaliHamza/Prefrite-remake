import React, { useState, useEffect } from "react";
import { fetchInactiveClients } from "../../api/clientsAPI";
// import "../../assets/css/Styles/InactiveClients.css"; // Import the CSS file
import Loading from "../../components/Loading";

const InactiveClients = () => {
  const [clients, setClients] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      fetchInactiveClients(startDate, endDate).then((response) => {
        setClients(response || []);
      })
  }, [startDate, endDate]);



  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
  };

  return (
    <div className="container mt-5">
      <div className="header">
        <a className="home-link" href="/superadmin">
          <i className="fas fa-home"></i>
        </a>
        <h2 className="title">Clients Inactives</h2>
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Debut:</label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startDate}
          onChange={(e) => handleDateChange(e, setStartDate)}
        />
        <label htmlFor="endDate">Fin:</label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={endDate}
          onChange={(e) => handleDateChange(e, setEndDate)}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="card-list">
          {clients.map((client) => (
            <div key={client._id} className="app-card">
              {client.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InactiveClients;
