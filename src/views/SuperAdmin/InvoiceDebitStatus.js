import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchInvoicesDebitData } from "../../api/invoicesAPI";
import "./InvoiceDebitStatus.css"; // Import the CSS file
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";

const InvoiceDebitStatus = () => {
  const { idClient } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();

  useEffect(() => {
    const getInvoicesData = async () => {
      try {
        // console.log("Invoices");
        const data = await fetchInvoicesDebitData(idClient);
        console.log(data);
        setInvoices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices data:", error);
        setLoading(false);
      }
    };

    getInvoicesData();
  }, [idClient]);

  if (loading) {
    return <Loading />;
  }

  const currentDate = new Date().toLocaleString();

  return (
    <div className="invoice-debit-status-container">
      <header className="invoice-debit-status-header">
        <div className="invoice-debit-status-nav">
          <button onClick={() => window.history.back()}>Retour</button>
        </div>
      </header>
      <div className="invoice-debit-status-title">
        <button className="print-button" onClick={handlePrint}>
          Imprimer
        </button>
      </div>
      <PrintComponent>
        <h2>CREDIT BL</h2>
        <div className="invoice-debit-status-date">{currentDate}</div>
        <table className="invoice-debit-status-table">
          <thead>
            <tr>
              <th>id</th>
              <th>Total</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>
                  <Link
                    to={`/superadmin/invoiceDebitStatus/invoiceDetail/${invoice._id}`}
                  >
                    {invoice._id}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/superadmin/invoiceDebitStatus/invoiceDetail/${invoice._id}`}
                  >
                    {invoice.total.toFixed(2)}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/superadmin/invoiceDebitStatus/invoiceDetail/${invoice._id}`}
                  >
                    {invoice.debit.toFixed(2)}
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

export default InvoiceDebitStatus;
