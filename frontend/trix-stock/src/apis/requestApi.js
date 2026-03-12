import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

export const createRequest = async(registerData) =>{
    try {
      const response = await api.post("/requests", registerData);
      return response.data;
    } catch (error) {
      console.error("Data fetching error " + error);
      throw error;
    }
}

export default api