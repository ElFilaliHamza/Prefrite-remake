import api from "./api";

export const buyArts = async (clientId, arts, payment) => {
    try {
        const response = await api.post("/seller/buy", {
            clientId: clientId,
            arts: arts,
            payment,
        });
        return response.data;
    } catch (error) {
        console.error("Error processing payment:", error);
    }
};



