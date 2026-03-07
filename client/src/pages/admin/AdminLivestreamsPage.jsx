import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminLivestreams } from "../../store/slices/adminSlice";
import { adminApiService } from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  streamUrl: "",
  scheduledAt: "",
  isLive: false,
  pastorName: "",
  sourceUrl: "",
  sourceType: "video",
  tags: "",
  category: "Livestream",
};

export default function AdminLivestreamsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminLivestreams());
  }, [dispatch]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (ls) => {
    setEditId(ls.id);
    setForm({
      title: ls.title || "",
      description: ls.description || "",
      streamUrl: ls.streamUrl || "",
      scheduledAt: ls.scheduledAt || "",
      isLive: !!ls.isLive,
      pastorName: ls.pastorName || "",
      sourceUrl: ls.sourceUrl || "",
      sourceType: ls.sourceType || "video",
      tags: Array.isArray(ls.tags) ? ls.tags.join(", ") : "",
      category: ls.category || "Livestream",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editId) {
        await adminApiService.adminUpdateLivestream(editId, data);
      } else {
        await adminApiService.adminCreateLivestream(data);
      }
      setShowForm(false);
      dispatch(fetchAdminLivestreams());
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this broadcast?")) return;
    try {
      await adminApiService.adminDeleteLivestream(id);
      dispatch(fetchAdminLivestreams());
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="text-admin-livestreams-title">Broadcasts</h1>
        <button data-testid="button-add-livestream" onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          Add New Broadcast
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-livestream-form-title">
            {editId ? "Edit Broadcast" : "New Broadcast"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input data-testid="input-livestream-title" name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stream URL</label>
              <input data-testid="input-livestream-streamUrl" name="streamUrl" value={form.streamUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scheduled At</label>
              <input data-testid="input-livestream-scheduledAt" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pastor Name</label>
              <input data-testid="input-livestream-pastorName" name="pastorName" value={form.pastorName} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input data-testid="input-livestream-category" name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
              <input data-testid="input-livestream-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
              <input data-testid="input-livestream-sourceType" name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
              <input data-testid="input-livestream-tags" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea data-testid="input-livestream-description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input data-testid="input-livestream-isLive" type="checkbox" name="isLive" checked={form.isLive} onChange={handleChange} className="rounded" />
              <label className="text-sm text-slate-700">Is Live</label>
            </div>
            <div />
            <div className="md:col-span-2 flex gap-3">
              <button data-testid="button-submit-livestream" type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button data-testid="button-cancel-livestream" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-slate-500" data-testid="text-loading">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-livestreams">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Scheduled</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Live</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Source Type</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.livestreams.map((ls) => (
              <tr key={ls.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-livestream-${ls.id}`}>
                <td className="px-4 py-3">{ls.id}</td>
                <td className="px-4 py-3 font-medium">{ls.title}</td>
                <td className="px-4 py-3">{ls.scheduledAt}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${ls.isLive ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                    {ls.isLive ? "Live" : "Off"}
                  </span>
                </td>
                <td className="px-4 py-3">{ls.sourceType}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button data-testid={`button-edit-livestream-${ls.id}`} onClick={() => openEdit(ls)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button data-testid={`button-delete-livestream-${ls.id}`} onClick={() => handleDelete(ls.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.livestreams.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No broadcasts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
