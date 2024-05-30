import api from './api';

export const fetchAlerts = async (skip = 0) => {
  try {
    const response = await api.post('/superadmin/alerts/get', { skip });
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const fetchAlertsCount = async () => {
  try {
    const response = await api.post('/superadmin/alerts/count');
    // console.log("Count Response"+response.data.count);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching alerts count:', error);
    throw error;
  }
};

