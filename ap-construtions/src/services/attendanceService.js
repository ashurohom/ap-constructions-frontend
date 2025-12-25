import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/attendance/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getAttendanceList = async (filters) => {
  const res = await axios.get(API_URL, {
    ...authHeader(),
    params: filters,
  });
  return res.data;
};

export const markAttendance = async (data) => {
  return axios.post(API_URL, data, authHeader());
};

export const markPaid = async (id) => {
  return axios.patch(`${API_URL}${id}/mark_paid/`, {}, authHeader());
};

export const markUnpaid = async (id) => {
  return axios.patch(`${API_URL}${id}/mark_unpaid/`, {}, authHeader());
};
