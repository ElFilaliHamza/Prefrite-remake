import api from './api'; // Ensure the api instance is set up correctly

export const getCategories = async (skip = 0, getAll = false) => {
  try {
    const response = await api.post('/superadmin/categories/get', { skip, getAll });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


export const addCategory = async (name) => {
  try {
    const response = await api.post('/superadmin/categories/add', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Add other category-related API calls here

// Add other category-related API calls here
