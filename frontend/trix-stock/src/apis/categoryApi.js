import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

export default api;

export const createCategory = async (category) =>{
    try {
        const response = await api.post("/categories", category);
        return response.data;
    } catch (error) {
        console.error('Creating category error '+ error)
        throw error
        
    }
    
}

export const getCategories = async () =>{
    try {
        const response = await api.get("/categories")
        return response.data
    } catch (error) {
        throw error
    }
}