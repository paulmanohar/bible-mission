import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin, clearAdminError } from "../../store/slices/adminSlice";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.admin);
  const [form, setForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        setAuthError("Not authorized");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAdminError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    dispatch(clearAdminError());
    dispatch(adminLogin({ username: form.username, password: form.password }));
  };

  const displayError = authError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white" data-testid="text-admin-login-title">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Bible Mission Content Management</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {displayError && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-400 text-sm border border-red-800 rounded" data-testid="text-admin-login-error">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username or Email</label>
              <input
                data-testid="input-admin-username"
                type="text"
                placeholder="Enter username or email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full h-10 px-3 border border-slate-600 bg-slate-700 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                data-testid="input-admin-password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full h-10 px-3 border border-slate-600 bg-slate-700 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
              />
            </div>
            <button
              data-testid="button-admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors" data-testid="link-back-to-site">
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
