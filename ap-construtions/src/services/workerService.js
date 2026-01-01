import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/workers/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
});

export const getWorkers = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const createWorker = async (data) => {
  const res = await axios.post(API_URL, data, authHeader());
  return res.data;
};

export const deleteWorker = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, authHeader());
  return res.data;
};

// FIXED: Changed API_BASE to API_URL
export const getWorkerById = async (workerId) => {
  try {
    const response = await axios.get(`${API_URL}${workerId}/`, authHeader());
    return response.data;
  } catch (error) {
    console.warn("Worker API endpoint not found, using fallback");
    return { id: workerId, name: `Worker #${workerId}` };
  }
};

// FIXED: Changed API_BASE to API_URL
export const getAllWorkers = async () => {
  try {
    const response = await axios.get(API_URL, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching workers:", error);
    return [];
  }
};


