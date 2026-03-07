import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminEvents } from "../../store/slices/adminSlice";
import { adminApiService } from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  latitude: "",
  longitude: "",
  pastorName: "",
  posterImage: "",
  approved: false,
  sourceUrl: "",
  sourceType: "image",
  tags: "",
};

export default function AdminEventsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminEvents());
  }, [dispatch]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (evt) => {
    setEditId(evt.id);
    setForm({
      title: evt.title || "",
      description: evt.description || "",
      date: evt.date || "",
      time: evt.time || "",
      location: evt.location || "",
      latitude: evt.latitude || "",
      longitude: evt.longitude || "",
      pastorName: evt.pastorName || "",
      posterImage: evt.posterImage || "",
      approved: !!evt.approved,
      sourceUrl: evt.sourceUrl || "",
      sourceType: evt.sourceType || "image",
      tags: Array.isArray(evt.tags) ? evt.tags.join(", ") : "",
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
        await adminApiService.adminUpdateEvent(editId, data);
      } else {
        await adminApiService.adminCreateEvent(data);
      }
      setShowForm(false);
      dispatch(fetchAdminEvents());
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await adminApiService.adminDeleteEvent(id);
      dispatch(fetchAdminEvents());
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="text-admin-events-title">Events</h1>
        <button data-testid="button-add-event" onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          Add New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-event-form-title">
            {editId ? "Edit Event" : "New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input data-testid="input-event-title" name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input data-testid="input-event-date" name="date" value={form.date} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input data-testid="input-event-time" name="time" value={form.time} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input data-testid="input-event-location" name="location" value={form.location} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
              <input data-testid="input-event-latitude" name="latitude" value={form.latitude} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
              <input data-testid="input-event-longitude" name="longitude" value={form.longitude} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pastor Name</label>
              <input data-testid="input-event-pastorName" name="pastorName" value={form.pastorName} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Poster Image URL</label>
              <input data-testid="input-event-posterImage" name="posterImage" value={form.posterImage} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
              <input data-testid="input-event-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
              <input data-testid="input-event-sourceType" name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
              <input data-testid="input-event-tags" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input data-testid="input-event-approved" type="checkbox" name="approved" checked={form.approved} onChange={handleChange} className="rounded" />
              <label className="text-sm text-slate-700">Approved</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea data-testid="input-event-description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button data-testid="button-submit-event" type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button data-testid="button-cancel-event" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-slate-500" data-testid="text-loading">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-events">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Date</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Location</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Approved</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Source Type</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.events.map((evt) => (
              <tr key={evt.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-event-${evt.id}`}>
                <td className="px-4 py-3">{evt.id}</td>
                <td className="px-4 py-3 font-medium">{evt.title}</td>
                <td className="px-4 py-3">{evt.date}</td>
                <td className="px-4 py-3">{evt.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${evt.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {evt.approved ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">{evt.sourceType}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button data-testid={`button-edit-event-${evt.id}`} onClick={() => openEdit(evt)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button data-testid={`button-delete-event-${evt.id}`} onClick={() => handleDelete(evt.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.events.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No events found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
