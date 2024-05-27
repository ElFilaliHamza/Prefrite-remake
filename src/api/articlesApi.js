import api from './api'; // Ensure the api instance is set up correctly

export const getArticles = async (catId, skip = 0, getAll = false) => {
  try {
    const response = await api.post('/superadmin/articles/get', { catId, skip, getAll });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const addArticle = async (formData) => {
  try {
    const response = await api.post('/superadmin/articles/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
};
