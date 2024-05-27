import React from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import SellerHome from './SellerHome';
import Sell from './Sell';
import ClientDebit from './ClientDebit';
import Invoices from './Invoices';
import InvoiceDetail from './InvoiceDetail';
import SellerState from './SellerState';
import '../assets/css/main.css';

const Seller = () => {
  let { path } = useMatch();

  return (
    <Routes>
      <Route exact path={path} component={SellerHome} />
      <Route path={`${path}/sell`} component={Sell} />
      <Route path={`${path}/client/:_id/debit`} component={ClientDebit} />
      <Route exact path={`${path}/invoices`} component={Invoices} />
      <Route exact path={`${path}/invoice/:_id`} component={InvoiceDetail} />
      <Route exact path={`${path}/state`} component={SellerState} />
    </Routes>
  );
};

export default Seller;
