import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/accounts";

/* =========================
   LOGIN (WITH THROTTLE HANDLING)
========================= */
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return {
      success: true,
    };
  } catch (error) {
    if (error.response) {
      // 🚫 TOO MANY REQUESTS (THROTTLED)
      if (error.response.status === 429) {
        return {
          success: false,
          type: "throttle",
          message:
            "Too many login attempts. Please try again after 1 minute.",
        };
      }

      // ❌ INVALID CREDENTIALS
      if (error.response.status === 400) {
        return {
          success: false,
          type: "invalid",
          message: "Invalid username or password",
        };
      }
    }

    // ⚠️ SERVER / NETWORK ERROR
    return {
      success: false,
      type: "server",
      message: "Server error. Please try again later.",
    };
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
   USER PROFILE
========================= */
export const getUserProfile = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const response = await axios.get(
      `${API_URL}/me/`,
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
