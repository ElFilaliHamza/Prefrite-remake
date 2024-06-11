import api from "./api";


export const fetchMagasinSellers = async () => {
    try {
        const response = await api.post('/magasin/vendeurs/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching magasin sellers:', error);
        throw error;
    }
};

export const fetchSellerDetails = async (id) => {
    try {
        const response = await api.post('/magasin/vendeurs/getOne', { _id: id });
        return response.data;
    } catch (error) {
        console.error('Error fetching seller details:', error);
        throw error;
    }
};

export const fetchMoreArticles = async ({ _id, skip, limit }) => {
    try {
        const response = await api.post('/magasin/vendeurs/getArticles', { _id, skip, limit });
        return response.data;
    } catch (error) {
        console.error('Error fetching more articles:', error);
        throw error;
    }
};

export const handPayement = async ({ idSeller, payment }) => {
    try {
        const response = await api.post('/magasin/vendeurs/handPayment', {
            _id: idSeller,
            payment: parseFloat(payment)
        });
        return response.data;
    } catch (error) {
        console.error('Error in handpayment api:', error);
        throw error;
    }
};

export const updateSellerArticle = async (idSeller, editArticleId, editArticleQty) => {
    try {
        const response = await api.post('/magasin/vendeurs/updateArticle', {
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

export const fetchClients = async (skip, search, sellerId) => {
    try {
        const response = await api.post('/magasin/clients/get', {
            skip,
            search,
            sellerId
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
};
export const fetchOneClient = async ({clientId, route='admin'}) => {
    try {
        const response = await api.post(`/${route}/clients/getOne`, { _id: clientId });
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
};

export const fetchMagasinCommands = async ({ skip = 0, fullfiled = null, filter = null, getSellers = false } = {}) => {
    try {
        const response = await api.post('/magasin/cmd/get', { skip, fullfiled, filter, getSellers });
        return response.data;
    } catch (error) {
        console.error('Error fetching commands:', error);
    }
};

export const fetchMagasinCommand = async (commandId) => {
    try {
        const response = await api.post('/magasin/cmd/getOne', { _id: commandId });
        return response.data;
    } catch (error) {
        console.error('Error fetching command :', error);
    }
};

