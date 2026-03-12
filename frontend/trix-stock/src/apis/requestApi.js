import axios from "axios";

const api = axios.create({
  baseURL: "https://trixstock.onrender.com",
});

export const createRequest = async (registerData) => {
  const response = await api.post("/requests", registerData);
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get("/requests");
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await api.patch(`/requests/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await api.patch(`/requests/${id}/reject`);
  return response.data;
};

export default api;
