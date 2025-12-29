import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logoutUser,
  getUserProfile,
} from "../services/authService";

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");

  /* =========================
     FETCH LOGGED-IN USER
  ========================= */
  useEffect(() => {
    if (loggedIn) {
      getUserProfile()
        .then((data) => {
          if (data?.username) {
            setUsername(data.username);
          }
        })
        .catch(() => setUsername(""));
    }
  }, [loggedIn]);

  const handleLogout = () => {
    logoutUser();
    setUsername("");
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= TOP BAR ================= */}
        <div className="h-16 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-xl text-white/80 hover:text-yellow-400 transition"
            >
              ←
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/ap_logo.png"
                alt="AP Constructions"
                className="h-11 w-11 rounded-lg shadow-md"
              />
              <span className="hidden sm:block text-xl font-semibold">
                AP Constructions
              </span>
            </div>
          </div>

          {/* ================= RIGHT DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-4">

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Home
            </button>

            {loggedIn && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
              >
                Dashboard
              </button>
            )}

            {!loggedIn ? (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold"
              >
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 transition"
                >
                  Logout
                </button>

                {/* USER INFO */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5
                             rounded-full bg-white/10
                             border border-white/20
                             shadow-sm"
                >
                  <span
                    className="h-7 w-7 rounded-full
                               bg-gradient-to-br from-blue-500 to-indigo-600
                               flex items-center justify-center
                               text-sm font-bold text-white"
                  >
                    {username?.charAt(0)?.toUpperCase()}
                  </span>

                  <span className="text-sm font-medium tracking-wide">
                    {username}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div className="md:hidden pb-4 space-y-3">

            {loggedIn && (
              <div
                className="mx-4 mb-2 flex items-center gap-3
                           px-4 py-3 rounded-xl
                           bg-white/10 border border-white/20"
              >
                <span
                  className="h-9 w-9 rounded-full
                             bg-gradient-to-br from-blue-500 to-indigo-600
                             flex items-center justify-center
                             font-bold text-white"
                >
                  {username?.charAt(0)?.toUpperCase()}
                </span>

                <span className="text-sm font-medium">
                  {username}
                </span>
              </div>
            )}

            <button
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg bg-white/10"
            >
              Home
            </button>

            {loggedIn && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-blue-600"
              >
                Dashboard
              </button>
            )}

            {!loggedIn ? (
              <button
                onClick={() => {
                  onLoginClick();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-yellow-400 text-slate-900"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg bg-red-500"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
