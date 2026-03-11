import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

export default api;

export const registerItem = async (itemData) => {
  try {
    const response = await api.post("/items", itemData);
    return response.data;
  } catch (error) {
    console.error("Data fetching error " + error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const res = await api.get("/items");
    return res.data;
  } catch (error) {
    console.error("Data fetching error " + error);
    throw error;
  }
};

export const getItemsByCategory = async () => {
  try {
    const res = await api.get("/items/by-category");
    return res.data;
  } catch (error) {
    console.error("Data fetching error " + error);
    throw error;
  }
};