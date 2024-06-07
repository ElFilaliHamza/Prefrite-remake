
import api from "./api";


export const fetchPayementHistory = async (startTime, endTime) => {
    try {
        const response = await api.post('/superadmin/stats/getHistory', {
            startTime: startTime,
            endTime: endTime
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching seller info:", error);
        return {};
    }
};