import api from "./api"; // Ensure the api instance is set up correctly

export const fetchInvoicesDebitData = async (idClient) => {
  try {
    const response = await api.post(
      "http://localhost/superadmin/debit/getInvoices",
      { _id: idClient }
    );
    console.log(idClient);
    return response.data.invoices;
  } catch (error) {
    console.error("Error fetching invoices debit data:", error);
    throw error;
  }
};

export const fetchInvoiceData = async (idInvoice, endpoint_route="/superadmin/debit/getInvoice") => {
  try {
    const response = await api.post(
      endpoint_route,
      { _id: idInvoice }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    throw error;
  }
};


export const fetchSellerInvoice = async (skip, filter) => {
  try {
    const response = await api.post('/seller/invoice/get', {
        skip,
        filter
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    throw error;
  }
};


