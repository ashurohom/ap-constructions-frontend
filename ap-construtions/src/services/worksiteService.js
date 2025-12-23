import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/worksites/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getWorksites = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const createWorksite = async (data) => {
  const res = await axios.post(API_URL, data, authHeader());
  return res.data;
};

export const changeWorksiteStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_URL}${id}/change_status/`,
    { status },
    authHeader()
  );
  return res.data;
};
