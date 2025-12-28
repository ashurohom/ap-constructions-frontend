import { useState, useEffect } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ RESET FORM STATE EVERY TIME MODAL OPENS
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await onLogin(username, password);
    if (!success) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      
      {/* Card */}
      <div
        className="bg-white rounded-2xl shadow-2xl 
                   w-full max-w-sm min-h-[520px]
                   px-8 py-10 relative flex flex-col justify-between"
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/ap_logo.png"
            alt="AP Constructions"
            className="h-16 w-auto mb-3"
          />

          <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
            AP Constructions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Admin Access Portal
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-slate-300 rounded-lg
                         px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg
                           px-4 py-2.5 pr-12
                           focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center
                           text-slate-500 hover:text-slate-800"
              >
                {showPassword ? (
                  /* Eye Off */
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M6.23 6.23A9.96 9.96 0 0112 5c4.48 0 8.27 2.94 9.54 7-.46 1.47-1.28 2.78-2.36 3.82"
                    />
                  </svg>
                ) : (
                  /* Eye */
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.46 12C3.73 7.94 7.52 5 12 5s8.27 2.94 9.54 7c-1.27 4.06-5.06 7-9.54 7s-8.27-2.94-9.54-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg
                       hover:bg-slate-800 transition
                       font-semibold tracking-wide"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-6">
          © {new Date().getFullYear()} AP Constructions
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
