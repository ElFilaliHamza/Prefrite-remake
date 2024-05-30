import api from './api'; // Ensure the api instance is set up correctly


export const fetchClientsDebitData = async (sellerId) => {
    try {
      const response = await api.post('http://localhost/superadmin/debit/getClients', { _id: sellerId });
      return response.data.clients;
    } catch (error) {
      console.error('Error fetching clients debit data:', error);
      throw error;
    }
  };