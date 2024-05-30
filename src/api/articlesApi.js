import api from "./api";

export const getArticles = async (catId, skip = 0, getAll = false) => {
  try {
    const response = await api.post("/superadmin/articles/get", { catId, skip, getAll });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const addArticle = async (formData) => {
  try {
    const response = await api.post("/superadmin/articles/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
};

export const getArticle = async (idArt) => {
  try {
    const response = await api.post("/superadmin/articles/getOne", { _id: idArt });
    return response.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};

export const updateArticle = async (idArt, formData) => {
  const formDataObj = new FormData();
  formDataObj.append("_id", idArt);
  for (const key in formData) {
    formDataObj.append(key, formData[key]);
  }
  try {
    const response = await api.post("/superadmin/articles/update", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};


export const deleteArticle = async (idArt) => {
  try {
    const response = await api.post("/superadmin/articles/delete", { _id: idArt });
    return response.data;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const getStockHistory = async (idArt, newSkip) => {
  try {
    const response = await api.post("/superadmin/articles/getHistory", { _id: idArt , skip: newSkip});
    return response.data;
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw error;
  }
};

export const fetchArticles = async () => {
  try {
    const response = await api.post('http://localhost/superadmin/articles/get', {
      getAll: true, // Adjust the request body as needed
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};
