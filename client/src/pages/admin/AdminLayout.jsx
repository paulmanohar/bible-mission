import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { adminLogout } from "../../store/slices/adminSlice";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Books", path: "/admin/books", icon: "📚" },
  { label: "Articles", path: "/admin/articles", icon: "📝" },
  { label: "Podcasts", path: "/admin/podcasts", icon: "🎙️" },
  { label: "Events", path: "/admin/events", icon: "📅" },
  { label: "Broadcasts", path: "/admin/livestreams", icon: "📡" },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.admin);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0" data-testid="admin-sidebar">
        <div className="p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold" data-testid="text-admin-brand">Bible Mission</h2>
          <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`link-admin-${item.label.toLowerCase()}`}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between" data-testid="admin-topbar">
          <div className="text-sm text-slate-500">
            Welcome, <span className="font-medium text-slate-800" data-testid="text-admin-name">{user.fullName || user.username}</span>
          </div>
          <button
            data-testid="button-admin-logout"
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
