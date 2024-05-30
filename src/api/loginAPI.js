import api from "./api";

export const login = async (username, password) => {
    try {
      const response = await api.post('/Login', { username, password });
      console.log("login");
      console.log(response.data);
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  // try {
  //   const response = await api.post("/login", { username, password });
  //   console.log("login");
  //   console.log(response.data);
  //   return response;
  // } catch (err) {
  //   console.error("An error occurred. Please try again.", err);
  //   throw err;
  //   }
};

export const logout = async () => {
  try {
    console.log("logout");
    const response = await api.post("/superadmin/session/logout");
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const checkSession = async () => {
  try {
    const response = await api.post("/session");
    return response.data;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};
