import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

// Helper rápido pra não repetir código
const headers = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("@TrixStock:token")}`,
  },
});

export const createCategory = async (category) => {
  try {
    // O headers vai como 3º parâmetro no POST
    const response = await api.post("/categories", category, headers());
    return response.data;
  } catch (error) {
    console.error("Creating category error " + error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    // O headers vai como 2º parâmetro no GET
    const response = await api.get("/categories", headers());
    return response.data;
  } catch (error) {
    throw error;
  }
};