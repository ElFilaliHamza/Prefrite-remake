import React, { useState, useEffect } from "react";
import "../../assets/css/Styles/InvoiceList.css"; // Ensure you have the necessary CSS for styling
import { fetchSellerInvoice } from "../../api/invoicesAPI";
import Loading from "../../components/Loading";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [endInvoice, setEndInvoice] = useState(false);
  const [filter, setFilter] = useState({
    state: "",
    name: "",
    ice: "",
    date: "",
  });
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [skip, filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await fetchSellerInvoice(skip, filter);
      setInvoices((prevInvoices) => [
        ...prevInvoices,
        ...(data.invoices || []),
      ]); // Append new invoices to existing ones
      setEndInvoice(data.endInvoice || false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setSkip(0); // Reset pagination on new filter change
    setInvoices([]); // Clear previous invoices on new filter change
  };

  return (
    <div className="container">
      <div className="content">
        <div className="content__inner">
          <div className="Container">
            <div className="multisteps-form">
              <div>
                <div className="invoice_filter form-row">
                  <form
                    className="invoice_filter-item inline-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchInvoices();
                    }}
                  >
                    <input
                      placeholder="Nom:"
                      className="form-control"
                      name="name"
                      value={filter.name}
                      onChange={handleFilterChange}
                    />
                    <label>
                      <div className="flat-btn-small btn-blue">Aller</div>
                      <input type="submit" hidden />
                    </label>
                  </form>
                  <div className="invoice_filter-item">
                    <select
                      className="form-control"
                      name="state"
                      value={filter.state}
                      onChange={handleFilterChange}
                    >
                      <option value="all">TOUS</option>
                      <option value="not_paid">NON PAYÉS</option>
                      <option value="paid">PAYÉS</option>
                    </select>
                  </div>
                  <div className="invoice_filter-item">
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={filter.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <table className="table list-invoice-table">
                    <thead>
                      <tr>
                        <th>CLIENT</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice._id}>
                          <td className="td-link">
                            <a href={`/seller/invoice/${invoice._id}`}>
                              {invoice.client.name}
                            </a>
                          </td>
                          <td className="td-link">
                            <a href={`/seller/invoice/${invoice._id}`}>
                              {new Date(invoice.time).toLocaleString()}
                            </a>
                          </td>
                          <td className="td-link">
                            <a href={`/seller/invoice/${invoice._id}`}>
                              <div
                                className={`invoice-status-${
                                  invoice.total === invoice.paid
                                    ? "cool"
                                    : "uncool"
                                }`}
                              >
                                <i
                                  className={`fas fa-${
                                    invoice.total === invoice.paid
                                      ? "check"
                                      : "bell"
                                  }`}
                                ></i>
                              </div>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!endInvoice && (
                  <div
                    className="flat-btn-small btn-blue show-more-btn"
                    onClick={() => setSkip(skip + 10)}
                  >
                    Afficher plus
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
