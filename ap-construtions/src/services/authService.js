import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/accounts";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return true;
  } catch (error) {
    return false;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};
