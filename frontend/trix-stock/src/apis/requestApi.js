import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

const headers = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("@TrixStock:token")}`,
  },
});

export const createRequest = async (registerData) => {
  const response = await api.post("/requests", registerData, headers());
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get("/requests", headers());
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await api.patch(`/requests/${id}/approve`, {}, headers());
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await api.patch(`/requests/${id}/reject`, {}, headers());
  return response.data;
};

export default api;
