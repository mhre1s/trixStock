import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

const headers = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("@TrixStock:token")}`,
  },
});

export const registerItem = async (itemData) => {
  try {
    const response = await api.post("/items", itemData, headers());
    return response.data;
  } catch (error) {
    console.error("Data fetching error " + error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const res = await api.get("/items", headers());
    return res.data;
  } catch (error) {
    console.error("Data fetching error " + error);
    throw error;
  }
};

export const getItemsByCategory = async () => {
  try {
    const res = await api.get("/items/by-category", headers());
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Erro ao carregar itens";
    console.error("Erro na API:", msg);
    throw msg;
  }
};