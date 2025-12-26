import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/expenses/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getExpenses = async (params = {}) => {
  const res = await axios.get(API_URL, {
    ...authHeader(),
    params,
  });
  return res.data;
};

export const createExpense = async (data) => {
  await axios.post(API_URL, data, authHeader());
};
