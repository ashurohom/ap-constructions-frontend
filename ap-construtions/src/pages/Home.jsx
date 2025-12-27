import { useState } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import { useNavigate } from "react-router-dom";
import { loginUser, isAuthenticated } from "../services/authService";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    const success = await loginUser(username, password);
    if (success) {
      setShowLogin(false);
      navigate("/dashboard");
      return true;
    }
    return false;
  };

  const handleDashboardClick = () => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar onLoginClick={() => setShowLogin(true)} />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-64px)] bg-slate-100 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Manage Construction Work <br />
              <span className="text-yellow-500">Smartly & Efficiently</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mb-6 max-w-xl mx-auto md:mx-0">
              AP Constructions helps you manage clients, workers, attendance,
              payroll, expenses and reports — all in one place.
            </p>

            <button
              onClick={handleDashboardClick}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Right Side */}
          <div className="space-y-4">

            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-100 rounded">
                <p className="text-xs text-slate-500">Workers</p>
                <p className="text-2xl font-bold text-slate-900">120+</p>
              </div>

              <div className="p-4 bg-slate-100 rounded">
                <p className="text-xs text-slate-500">Clients</p>
                <p className="text-2xl font-bold text-slate-900">45+</p>
              </div>

              <div className="p-4 bg-slate-100 rounded">
                <p className="text-xs text-slate-500">Active Sites</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>

              <div className="p-4 bg-slate-100 rounded">
                <p className="text-xs text-slate-500">Daily Attendance</p>
                <p className="text-2xl font-bold text-slate-900">Live</p>
              </div>
            </div>

            {/* Developer Profile Card */}
            {/* Developer Credit – Advanced One Line */}
            <div className="bg-white rounded-lg shadow px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              
              <span className="text-slate-600">
                Designed & Developed by{" "}
                <span className="font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Ashitosh Rohom
                </span>
              </span>

              <a
                href="https://ashitoshrohom.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                          bg-slate-900 text-white text-sm font-medium
                          hover:bg-slate-800 hover:shadow-md transition-all"
              >
                🤝 Connect
              </a>

            </div>



          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Home;
