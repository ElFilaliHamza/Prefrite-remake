import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Loading from '../components/Loading';
import { useAppContext } from '../components/AppContext';
import '../assets/css/main.css';

const Stats = () => {
  const [state] = useAppContext();
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState({ startTime: "", endTime: "" });

  useEffect(() => {
    if (!stats) {
      api.post('/superadmin/stats', { startTime: filter.startTime, endTime: filter.endTime })
        .then(response => {
          if (response.ok) {
            setStats(response.stats);
          }
        });
    }
  }, [stats, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Statistics</h1>
      <form>
        <input
          type="date"
          name="startTime"
          value={filter.startTime}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endTime"
          value={filter.endTime}
          onChange={handleFilterChange}
        />
        <button type="submit">Filter</button>
      </form>
      {stats ? (
        <div>
          <h2>Total Sales: {stats.totalSales}</h2>
          <h2>Total Invoices: {stats.totalInvoices}</h2>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Stats;
