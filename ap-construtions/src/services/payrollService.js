import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/payroll/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
});

const handleError = (error) => {
  console.error("API Error:", error);
  if (error.response) {
    throw new Error(error.response.data.error || error.response.data.detail || "Server error");
  } else if (error.request) {
    throw new Error("No response from server. Please check your connection.");
  } else {
    throw new Error("Request error: " + error.message);
  }
};

export const generatePayroll = async (month) => {
  try {
    const response = await axios.post(`${API_BASE}generate/`, { month }, authHeader());
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPayrollList = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE, { ...authHeader(), params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWorkerPayrollHistory = async (workerId) => {
  try {
    const response = await axios.get(`${API_BASE}worker-history/${workerId}/`, authHeader());
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWorkerPayrollLedger = async (workerId, month) => {
  try {
    const response = await axios.get(`${API_BASE}ledger/${workerId}/`, {
      ...authHeader(),
      params: { month },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const addSalaryPayment = async (payload) => {
  try {
    // Changed from `${API_BASE}pay/` to `${API_BASE}pay/`
    const response = await axios.post(`${API_BASE}pay/`, payload, authHeader());
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Optional: Add more functions if needed
export const getPaymentTypes = () => {
  return [
    { value: "ADVANCE", label: "Advance" },
    { value: "FINAL", label: "Final Salary" },
    { value: "ADJUSTMENT", label: "Adjustment" },
  ];
};