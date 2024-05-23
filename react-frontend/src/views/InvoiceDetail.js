import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../components/AppContext';
import api from '../../../react-frontend/src/api/api';
import Loading from '../components/Loading';
import { Navigate } from 'react-router-dom';

const InvoiceDetail = () => {
  const { _id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [state] = useAppContext();

  useEffect(() => {
    api.post('/seller/invoice/getOne', { _id }).then(response => {
      if (response.ok) {
        setInvoice(response.invoice);
      }
    });
  }, [_id]);

  if (!state.logged) {
    return <Navigate to="/" />;
  }

  if (!invoice) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Invoice Detail</h1>
      <p>Client: {invoice.clientName}</p>
      <p>Total: {invoice.total}</p>
      <p>Paid: {invoice.paid}</p>
    </div>
  );
};

export default InvoiceDetail;
