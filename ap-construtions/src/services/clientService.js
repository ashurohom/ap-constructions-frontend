import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/clients/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getClients = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const createClient = async (data) => {
  await axios.post(API_URL, data, authHeader());
};

export const deleteClient = async (id) => {
  await axios.delete(`${API_URL}${id}/`, authHeader());
};
