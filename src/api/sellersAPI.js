import api from "./api";

export const fetchSellersInfo = async () => {
  try {
    const response = await api.post('/superadmin/sellersInfo/get');
    return response.data.sellers;
  } catch (error) {
    console.error('Error fetching sellers info:', error);
    throw error;
  }
};
export const fetchConnectedSellers = async () => {
  try {
    const response = await api.get('/superadmin/connected'); // Adjust the path as needed
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching connected sellers', error);
    throw error;
  }
};

export const fetchSellersData = async (startTime, endTime) => {
  try {
    // console.log("sellers");
    const response = await api.post('http://localhost/superadmin/sellers/get', { startTime, endTime });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
export const fetchSellerData = async (_id, startTime, endTime) => {
  try {
    const response = await api.post('http://localhost/superadmin/sellers/getOne', { _id, startTime, endTime });
    console.log("seller getseller info");
    console.log(response.data);

    return response.data.seller;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
// export const fetchSellerData = async (sellerId) => {
//   const response = await fetch(`http://localhost/superadmin/sellers/getOne`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ _id: sellerId }),
//   });
//   const data = await response.json();
//   if (!data.seller) {
//     throw new Error('Seller not found');
//   }
//   return data;
// };

export const fetchSellersDebitData = async () => {
  try {
    const response = await api.post('http://localhost/superadmin/debit/getSellers');
    return response.data.sellers;
  } catch (error) {
    console.error('Error fetching sellers debit data:', error);
    throw error;
  }
};

export const updateSellerCharges = async (idSeller, newCharges) => {
  const response = await api.post('http://localhost/superadmin/sellers/updateCharges', {
    _id: idSeller,
    newCharges
  });
  return response.data;
};