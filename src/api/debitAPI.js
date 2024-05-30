import api from "./api"; // Ensure the api instance is set up correctly

export const fetchDebitCount = async () => {
    try {
      const response = await api.post('/superadmin/debit/count');
      return response.data.totalDebit.toFixed(2) || 0;
    } catch (error) {
      console.error('Error fetching debit count:', error);
      throw error;
    }
  };