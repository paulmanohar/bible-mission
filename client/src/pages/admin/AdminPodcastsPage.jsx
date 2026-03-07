import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminPodcasts } from "../../store/slices/adminSlice";
import { adminApiService } from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  audioUrl: "",
  duration: "",
  episodeNumber: "",
  published: false,
  sourceUrl: "",
  sourceType: "audio",
  tags: "",
  category: "Podcast",
};

export default function AdminPodcastsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminPodcasts());
  }, [dispatch]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (pod) => {
    setEditId(pod.id);
    setForm({
      title: pod.title || "",
      description: pod.description || "",
      audioUrl: pod.audioUrl || "",
      duration: pod.duration || "",
      episodeNumber: pod.episodeNumber != null ? String(pod.episodeNumber) : "",
      published: !!pod.published,
      sourceUrl: pod.sourceUrl || "",
      sourceType: pod.sourceType || "audio",
      tags: Array.isArray(pod.tags) ? pod.tags.join(", ") : "",
      category: pod.category || "Podcast",
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
        episodeNumber: form.episodeNumber ? parseInt(form.episodeNumber, 10) : null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editId) {
        await adminApiService.adminUpdatePodcast(editId, data);
      } else {
        await adminApiService.adminCreatePodcast(data);
      }
      setShowForm(false);
      dispatch(fetchAdminPodcasts());
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this podcast?")) return;
    try {
      await adminApiService.adminDeletePodcast(id);
      dispatch(fetchAdminPodcasts());
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="text-admin-podcasts-title">Podcasts</h1>
        <button data-testid="button-add-podcast" onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          Add New Podcast
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-podcast-form-title">
            {editId ? "Edit Podcast" : "New Podcast"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input data-testid="input-podcast-title" name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audio URL</label>
              <input data-testid="input-podcast-audioUrl" name="audioUrl" value={form.audioUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <input data-testid="input-podcast-duration" name="duration" value={form.duration} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Episode Number</label>
              <input data-testid="input-podcast-episodeNumber" name="episodeNumber" value={form.episodeNumber} onChange={handleChange} type="number" className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input data-testid="input-podcast-category" name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
              <input data-testid="input-podcast-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
              <input data-testid="input-podcast-sourceType" name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
              <input data-testid="input-podcast-tags" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea data-testid="input-podcast-description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input data-testid="input-podcast-published" type="checkbox" name="published" checked={form.published} onChange={handleChange} className="rounded" />
              <label className="text-sm text-slate-700">Published</label>
            </div>
            <div />
            <div className="md:col-span-2 flex gap-3">
              <button data-testid="button-submit-podcast" type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button data-testid="button-cancel-podcast" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-slate-500" data-testid="text-loading">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-podcasts">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Episode #</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Duration</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Published</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Source Type</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.podcasts.map((pod) => (
              <tr key={pod.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-podcast-${pod.id}`}>
                <td className="px-4 py-3">{pod.id}</td>
                <td className="px-4 py-3 font-medium">{pod.title}</td>
                <td className="px-4 py-3">{pod.episodeNumber}</td>
                <td className="px-4 py-3">{pod.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${pod.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {pod.published ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">{pod.sourceType}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button data-testid={`button-edit-podcast-${pod.id}`} onClick={() => openEdit(pod)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button data-testid={`button-delete-podcast-${pod.id}`} onClick={() => handleDelete(pod.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.podcasts.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No podcasts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
