import { useState, useEffect } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ RESET FORM WHEN MODAL OPENS
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await onLogin(username, password);

    if (!result.success) {
      setError(result.message);

      setUsername("");
      setPassword("");
      setShowPassword(false);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      {/* CARD */}
      <div
        className="bg-white rounded-2xl shadow-2xl 
                   w-full max-w-sm min-h-[520px]
                   px-8 py-10 relative flex flex-col justify-between"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
        >
          ✕
        </button>

        {/* HEADER */}
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

        {/* 🔔 BEAUTIFUL ERROR NOTIFICATION */}
        {error && (
          <div
            className="mt-5 flex items-start gap-3 
                       bg-red-50 border border-red-200 
                       text-red-700 rounded-xl px-4 py-3
                       animate-[fadeIn_0.3s_ease-out]"
          >
            {/* ICON */}
            <span className="text-xl mt-0.5">⚠️</span>

            {/* TEXT */}
            <div className="text-sm leading-relaxed">
              <p className="font-semibold">Login Failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* USERNAME */}
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

          {/* PASSWORD */}
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

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center
                           text-slate-500 hover:text-slate-800"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg
                       hover:bg-slate-800 transition
                       font-semibold tracking-wide"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-6">
          © {new Date().getFullYear()} AP Constructions
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
