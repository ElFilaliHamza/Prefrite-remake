import api from "./api"; // Ensure the api instance is set up correctly

export const downloadDatabaseBackup = async () => {
  try {
    const response = await api.post("/superadmin/db/backup", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "backup.zip"); // or whatever your server sends
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading database backup:", error);
  }
};

export const requestSellerAccess = async () => {
  try {
    // Request access for seller
    const accessResponse = await api.post("/superadmin/access", {
      type: "seller",
    });

    return accessResponse.data.ok;
  } catch (error) {
    console.error("Error requesting seller access:", error);
    throw error;
  }
};

export const createSellerSession = async () => {
  try {
    const sessionResponse = await api.post("/seller/session");
    return sessionResponse.data.logged;
  } catch (error) {
    console.error("Error creating seller session:", error);
    throw error;
  }
};
