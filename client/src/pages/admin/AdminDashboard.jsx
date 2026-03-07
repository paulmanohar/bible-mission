import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAdminBooks,
  fetchAdminEvents,
  fetchAdminBlogPosts,
  fetchAdminPodcasts,
  fetchAdminLivestreams,
} from "../../store/slices/adminSlice";

const sections = [
  { key: "books", label: "Books", path: "/admin/books", icon: "📚" },
  { key: "blogPosts", label: "Articles", path: "/admin/articles", icon: "📝" },
  { key: "podcasts", label: "Podcasts", path: "/admin/podcasts", icon: "🎙️" },
  { key: "events", label: "Events", path: "/admin/events", icon: "📅" },
  { key: "livestreams", label: "Livestreams", path: "/admin/livestreams", icon: "📡" },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminBooks());
    dispatch(fetchAdminEvents());
    dispatch(fetchAdminBlogPosts());
    dispatch(fetchAdminPodcasts());
    dispatch(fetchAdminLivestreams());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6" data-testid="text-admin-dashboard-title">Dashboard</h1>

      {loading && <p className="text-slate-500 mb-4" data-testid="text-loading">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sections.map((s) => (
          <Link
            key={s.key}
            to={s.path}
            data-testid={`card-dashboard-${s.key}`}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="text-lg font-semibold text-slate-700">{s.label}</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600" data-testid={`text-count-${s.key}`}>
              {items[s.key]?.length ?? 0}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
