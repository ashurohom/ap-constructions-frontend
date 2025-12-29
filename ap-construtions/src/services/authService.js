import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/accounts";

/* =========================
   LOGIN
========================= */
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
    console.error("Login failed", error);
    return false;
  }
};

/* =========================
   LOGOUT
========================= */
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

/* =========================
   AUTH CHECK
========================= */
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

/* =========================
   USER PROFILE (FIXED)
========================= */
export const getUserProfile = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/accounts/me/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Profile fetch failed", error);
    return null;
  }
};

