import config from "../config/config";
import api from "./api"; // Ensure the api instance is set up correctly

export const fetchInvoicesDebitData = async (idClient, route=config.BASE_ROUTE.SUPER_ADMIN) => {
  try {
    const endpoint_route = `/${route}/debit/getInvoices`;
    const response = await api.post(
      endpoint_route,
      { _id: idClient }
    );
    console.log(idClient);
    return response.data.invoices;
  } catch (error) {
    console.error("Error fetching invoices debit data:", error);
    throw error;
  }
};

export const fetchInvoiceData = async (idInvoice, route=config.BASE_ROUTE.SUPER_ADMIN) => {
  try {
    const endpoint_route =`/${route}/debit/getInvoice`;
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


