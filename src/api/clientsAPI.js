import api from "./api"; // Ensure the api instance is set up correctly

export const fetchClientsDebitData = async (sellerId, endpoint_route="/superadmin/debit/getClients") => {
  try {
    const response = await api.post(
      endpoint_route,
      { _id: sellerId }
    );
    return response.data.clients;
  } catch (error) {
    console.error("Error fetching clients debit data:", error);
    throw error;
  }
};

export const fetchInactiveClients = async (startDate, endDate) => {
  
  try {
    const response = await api.post(
      "/superadmin/clients/getInactive",
      {
        startTime: startDate,
        endTime: endDate,
      }
    );
    // console.log("response.data.clients");
    // console.log(response.data.clients);
    return response.data.clients || [];
  } catch (error) {
    console.error("Error fetching inactive clients:", error);
  }
};


