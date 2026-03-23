import axios from "axios";

const API_URL = "https://trixstock.onrender.com";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};
