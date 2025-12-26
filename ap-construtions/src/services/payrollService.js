import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/payroll/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const generatePayroll = async (month) => {
  return axios.post(
    `${API_BASE}generate/`,
    { month },
    authHeader()
  );
};

export const getPayrollList = async (params = {}) => {
  const res = await axios.get(API_BASE, {
    ...authHeader(),
    params,
  });
  return res.data;
};

export const markPayrollPaid = async (id) => {
  return axios.patch(
    `${API_BASE}${id}/mark_paid/`,
    {},
    authHeader()
  );
};

export const markPayrollUnpaid = async (id) => {
  return axios.patch(
    `${API_BASE}${id}/mark_unpaid/`,
    {},
    authHeader()
  );
};

export const getWorkerPayrollHistory = async (workerId) => {
  const res = await axios.get(
    `${API_BASE}worker-history/${workerId}/`,
    authHeader()
  );
  return res.data;
};
