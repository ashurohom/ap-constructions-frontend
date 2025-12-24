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
    <nav className="w-full bg-slate-900 text-white h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Left: Back Button + Logo */}
        <div className="flex items-center gap-3">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-yellow-400 transition"
            title="Go back"
          >
            ←
          </button>

          {/* Logo */}
          <div className="w-10 h-10 bg-yellow-500 text-slate-900 font-bold flex items-center justify-center rounded">
            AP
          </div>

          <span className="text-lg font-semibold tracking-wide">
            AP Constructions
          </span>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-4">
          {loggedIn && (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition"
            >
              Dashboard
            </button>
          )}

          {!loggedIn ? (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-yellow-500 text-slate-900 font-medium rounded hover:bg-yellow-400 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-400 transition"
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
