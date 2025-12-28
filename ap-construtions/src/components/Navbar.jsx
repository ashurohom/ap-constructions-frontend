import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../services/authService";

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP BAR */}
        <div className="h-16 flex items-center justify-between">

          {/* LEFT: Back + Logo */}
          <div className="flex items-center gap-3">

            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="text-xl text-white/80 hover:text-yellow-400 transition"
              title="Go back"
            >
              ←
            </button>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src="/ap_logo.png"
                alt="AP Constructions"
                className="h-11 w-11 rounded-lg shadow-md group-hover:scale-105 transition"
              />
              <span className="hidden sm:block text-xl font-semibold tracking-wide group-hover:text-yellow-400 transition">
                AP Constructions
              </span>
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-white/10 hover:bg-white/20
                         border border-white/10 transition"
            >
              Home
            </button>

            {loggedIn && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-medium
                           bg-blue-600 hover:bg-blue-500
                           shadow-md transition"
              >
                Dashboard
              </button>
            )}

            {!loggedIn ? (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-lg text-sm font-semibold
                           bg-yellow-400 text-slate-900
                           hover:bg-yellow-300 shadow-md transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold
                           bg-red-500 hover:bg-red-400 shadow-md transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-white"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden pb-4 space-y-3">

            <button
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-lg
                         bg-white/10 hover:bg-white/20 transition"
            >
              Home
            </button>

            {loggedIn && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg
                           bg-blue-600 hover:bg-blue-500 transition"
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
                className="block w-full text-left px-4 py-2 rounded-lg
                           bg-yellow-400 text-slate-900 hover:bg-yellow-300 transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg
                           bg-red-500 hover:bg-red-400 transition"
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
