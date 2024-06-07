import config from "../config/config";
import api from "./api";

export const fetchSellersInfo = async () => {
  try {
    const response = await api.post("/superadmin/sellersInfo/get");
    return response.data.sellers;
  } catch (error) {
    console.error("Error fetching sellers info:", error);
    throw error;
  }
};
export const fetchConnectedSellers = async () => {
  try {
    const response = await api.get("/superadmin/connected"); // Adjust the path as needed
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching connected sellers", error);
    throw error;
  }
};

export const fetchSellersData = async (startTime, endTime) => {
  try {
    // console.log("sellers");
    const response = await api.post("http://localhost/superadmin/sellers/get", {
      startTime,
      endTime,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const fetchSellerData = async (_id, startTime, endTime) => {
  try {
    const response = await api.post(
      "http://localhost/superadmin/sellers/getOne",
      { _id, startTime, endTime }
    );
    // console.log("seller getseller info");
    // console.log(response.data);

    return response.data.seller;
  } catch (error) {
    console.error("Error fetching data:", error);
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
    const response = await api.post(
      "http://localhost/superadmin/debit/getSellers"
    );
    return response.data.sellers;
  } catch (error) {
    console.error("Error fetching sellers debit data:", error);
    throw error;
  }
};

export const updateSellerCharges = async (idSeller, newCharges) => {
  const response = await api.post(
    "http://localhost/superadmin/sellers/updateCharges",
    {
      _id: idSeller,
      newCharges,
    }
  );
  return response.data;
};

export const requestSellerAccess = async () => {
  try {
    const response = await api.post("/superadmin/access", {
      type: "seller",
    });
    return response.data.ok;
  } catch (error) {
    console.error("Error requesting seller access:", error);
    return false;
  }
};

export const createSellerSession = async () => {
  try {
    const response = await api.post("/seller/session");
    return response.data.logged;
  } catch (error) {
    console.error("Error creating seller session:", error);
    return false;
  }
};

export const fetchSellerInfo = async () => {
  try {
    const response = await api.post("/seller/getAllInfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller info:", error);
    return {};
  }
};

export const checkSellerAccess = async () => {
  try {
    // Request access for seller
    const accessResponse = await api.post("/superadmin/access", {
      type: config.BASE_ROUTE.SELLER,
    });
    return accessResponse.data;
  } catch (error) {
    console.error("Error checking seller access:", error);
    throw error;
  }
};
export const checkAdminAccess = async () => {
  try {
    // Request access for seller
    const accessResponse = await api.post("/superadmin/access", {
      type: config.BASE_ROUTE.ADMIN,
    });
    return accessResponse.data;
  } catch (error) {
    console.error("Error checking seller access:", error);
    throw error;
  }
};

export const fetchClients = async () => {
  try {
    const response = await api.post("/seller/getAllInfo");

    return response.data;
  } catch (error) {
    console.error("Error fetching clients data", error);
  }
};

export const fetchCmds = async (skip = 0) => {
  try {
    const response = await api.post("/seller/cmd/get", {
      skip,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching seller Cmd:", error);
  }
};


export const fetchCmd = async (idCmd) => {
  try {
    const response = await api.post("http://localhost/seller/cmd/getOne", {
      _id: idCmd,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching seller Cmd:", error);
  }
};

export const fetchCategoriesAndArticles = async () => {
  try {
    const response = await api.post('/seller/getToCommand');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories and articles:", error);
    return { categories: [], articles: [] };
  }
};


export const addCommand = async (articles) => {
  try {
    const response = await api.post('/seller/addCommand', { articles });
    return response.data;
  } catch (error) {
    console.error('Error adding command:', error);
    return { ok: false };
  }
};


