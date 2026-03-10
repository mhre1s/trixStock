import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
})

export const registerUser = async(userData) =>{
    const response = await api.post('/users', userData)
    return response.data
}