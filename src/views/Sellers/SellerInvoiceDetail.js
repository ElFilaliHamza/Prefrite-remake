import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInvoiceData } from "../../api/invoicesAPI";
import Loading from "../../components/Loading";
import Invoice from "../../components/Invoice";

const SellerInvoiceDetail = ({route}) => {
  const { idInvoice } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInvoiceData = async () => {
      try {
        const data = await fetchInvoiceData(idInvoice,route);
        // console.log("Invoice")
        // console.log(data)
        setInvoice(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
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
    <>
      <Invoice invoice={invoice} currentDate={currentDate} showPeyementHistory={true} showActions={true}/>
    </>
  );
};

export default SellerInvoiceDetail;
