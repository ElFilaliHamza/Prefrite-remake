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

export const fetchInvoiceData = async (invoiceId) => {
  try {
    const response = await api.post(
      "http://localhost/superadmin/debit/getInvoice",
      { _id: invoiceId }
    );
    return response.data.invoice;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    throw error;
  }
};
