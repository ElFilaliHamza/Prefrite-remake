import api from './api';

export const fetchAccounts = async () => {
    try {
      const response = await api.post('/superadmin/accounts/get');
    //   console.log("response.data.accounts");
    //   console.log(response.data.accounts);
      return response.data.accounts;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  export const createAccount = async (account) => {
    try {
      const response = await api.post('/superadmin/accounts/create', account);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };