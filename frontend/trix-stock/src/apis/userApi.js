import axios from 'axios'

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

export const registerUser = async(userData) =>{
    const response = await api.post('/users', userData)
    return response.data
}