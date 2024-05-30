import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchInvoiceData } from '../../api/invoicesAPI';
import './InvoiceDetail.css'; // Import the CSS file
import Loading from '../../components/Loading';
import { usePrintComponent } from "../../tools/printComponent";

const InvoiceDetail = () => {
  const { idInvoice } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handlePrint, PrintComponent] = usePrintComponent();

  useEffect(() => {
    const getInvoiceData = async () => {
      try {
        const data = await fetchInvoiceData(idInvoice);
        console.log("Invoice")
        console.log(data)
        setInvoice(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        setLoading(false);
      }
    };

    getInvoiceData();
  }, [idInvoice]);

  if (loading) {
    return <Loading />;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const currentDate = new Date().toLocaleString();

  return (
    <div className="invoice-detail-container">
      <header className="invoice-detail-header">
        <div className="invoice-detail-nav">
          <button onClick={() => window.history.back()}>Retour</button>
        </div>
      </header>
      <div className="invoice-detail-title">
        <button className="print-button" onClick={handlePrint}>Imprimer</button>
      </div>
      <PrintComponent>
        <h2>BON DE LIVRAISON</h2>
      <div className="invoice-detail-date">{currentDate}</div>
      <div className="invoice-detail-content">
        <h1 className="invoice-company">Prefrite</h1>
        <p>CLIENT : {invoice.client.name}</p>
        <p>ICE : {invoice.client.ice}</p>
        <p>DATE : {new Date(invoice.date).toLocaleString()}</p>
        <table className="invoice-detail-table">
          <thead>
            <tr>
              <th>PRODUIT</th>
              <th>QTE</th>
              <th>PRIX</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.qt}</td>
                <td>
                  {product.price ? product.price.toFixed(2) : 0} DHS
                  {product.price && product.qt ? (
                    <div className="price-calcul">
                      ({product.qt} * {product.price.toFixed(2)} DHS)
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </PrintComponent>
    </div>
  );
};

export default InvoiceDetail;
