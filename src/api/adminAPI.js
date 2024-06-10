import api from "./api";


export const fetchAdminSellers = async () => {
    try {
        const response = await api.post('/admin/vendeurs/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin sellers:', error);
        throw error;
    }
};

export const fetchSellerDetails = async (id) => {
    try {
        const response = await api.post('/admin/vendeurs/getOne', { _id: id });
        return response.data;
    } catch (error) {
        console.error('Error fetching seller details:', error);
        throw error;
    }
};

export const fetchMoreArticles = async ({ _id, skip, limit }) => {
    try {
        const response = await api.post('/admin/vendeurs/getArticles', { _id, skip, limit });
        return response.data;
    } catch (error) {
        console.error('Error fetching more articles:', error);
        throw error;
    }
};

export const handPayement = async ({ idSeller, payment }) => {
    try {
        const response = await api.post('/admin/vendeurs/handPayment', {
            _id: idSeller,
            payment: parseFloat(payment)
          });
        return response.data;
    } catch (error) {
        console.error('Error in handpayment api:', error);
        throw error;
    }
};

export const updateSellerArticle = async (idSeller, editArticleId , editArticleQty) => {
    try {
        const response =await api.post('/admin/vendeurs/updateArticle', {
            sellerId: idSeller,
            _id: editArticleId,
            qt: parseFloat(editArticleQty)
          });
        return response.data;
    } catch (error) {
        console.error('Error in handpayment api:', error);
        throw error;
    }
};

