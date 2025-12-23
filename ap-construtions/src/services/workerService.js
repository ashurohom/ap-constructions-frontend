import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/workers/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getWorkers = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const createWorker = async (data) => {
  const res = await axios.post(API_URL, data, authHeader());

  // ✅ return response so frontend knows it succeeded
  return res.data;
};

export const deleteWorker = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, authHeader());
  return res.data;
};
