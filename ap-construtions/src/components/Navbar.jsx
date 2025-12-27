import { useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../services/authService";

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white h-18 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">

        {/* LEFT: Back + Logo */}
        <div className="flex items-center gap-4">

          {/* Back Button */}
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
            title="Home"
          >
            <img
              src="/ap_logo.png"
              alt="AP Constructions Logo"
              className="h-12 w-12 object-contain rounded-lg shadow-md group-hover:scale-105 transition"
            />
            <span className="text-xl font-semibold tracking-wide group-hover:text-yellow-400 transition">
              AP Constructions
            </span>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg text-sm font-medium
                       bg-white/10 hover:bg-white/20
                       border border-white/10
                       transition shadow-sm"
          >
            Home
          </button>

          {/* Dashboard */}
          {loggedIn && (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-blue-600 hover:bg-blue-500
                         shadow-md hover:shadow-lg transition"
            >
              Dashboard
            </button>
          )}

          {/* Login / Logout */}
          {!loggedIn ? (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-lg text-sm font-semibold
                         bg-yellow-400 text-slate-900
                         hover:bg-yellow-300
                         shadow-md hover:shadow-lg transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-semibold
                         bg-red-500 hover:bg-red-400
                         shadow-md hover:shadow-lg transition"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
