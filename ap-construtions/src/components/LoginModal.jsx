import { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-lg"
        >
          ✕
        </button>

        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/ap_logo.png"
            alt="AP Constructions"
            className="h-16 w-16 rounded-lg shadow-md mb-2"
          />
          <h2 className="text-xl font-bold text-slate-900">
            AP Constructions
          </h2>
          <p className="text-sm text-slate-500">Admin Login</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full border rounded-lg px-4 py-2
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
                placeholder="Enter password"
                className="w-full border rounded-lg px-4 py-2 pr-12
                           focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Show / Hide Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center
                           text-slate-500 hover:text-slate-800"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-lg
                       hover:bg-slate-800 transition font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
