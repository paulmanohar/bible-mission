import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminBooks } from "../../store/slices/adminSlice";
import { adminApiService } from "../../services/api";

const emptyForm = {
  title: "",
  author: "M.Devadas Ayyagaru",
  language: "English",
  category: "",
  imageId: "",
  description: "",
  coverImage: "",
  contentUrl: "",
  sourceUrl: "",
  sourceType: "pdf",
  tags: "",
};

export default function AdminBooksPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminBooks());
  }, [dispatch]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (book) => {
    setEditId(book.id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      language: book.language || "",
      category: book.category || "",
      imageId: book.imageId || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      contentUrl: book.contentUrl || "",
      sourceUrl: book.sourceUrl || "",
      sourceType: book.sourceType || "pdf",
      tags: Array.isArray(book.tags) ? book.tags.join(", ") : "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        await adminApiService.adminUpdateBook(editId, data);
      } else {
        await adminApiService.adminCreateBook(data);
      }
      setShowForm(false);
      dispatch(fetchAdminBooks());
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await adminApiService.adminDeleteBook(id);
      dispatch(fetchAdminBooks());
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="text-admin-books-title">Books</h1>
        <button
          data-testid="button-add-book"
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add New Book
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-book-form-title">
            {editId ? "Edit Book" : "New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input data-testid="input-book-title" name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input data-testid="input-book-author" name="author" value={form.author} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
              <input data-testid="input-book-language" name="language" value={form.language} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input data-testid="input-book-category" name="category" value={form.category} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image ID</label>
              <input data-testid="input-book-imageId" name="imageId" value={form.imageId} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input data-testid="input-book-coverImage" name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content URL</label>
              <input data-testid="input-book-contentUrl" name="contentUrl" value={form.contentUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
              <input data-testid="input-book-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
              <input data-testid="input-book-sourceType" name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
              <input data-testid="input-book-tags" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea data-testid="input-book-description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button data-testid="button-submit-book" type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button data-testid="button-cancel-book" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-slate-500" data-testid="text-loading">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-books">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Author</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Language</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Category</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Source Type</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.books.map((book) => (
              <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-book-${book.id}`}>
                <td className="px-4 py-3">{book.id}</td>
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.language}</td>
                <td className="px-4 py-3">{book.category}</td>
                <td className="px-4 py-3">{book.sourceType}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button data-testid={`button-edit-book-${book.id}`} onClick={() => openEdit(book)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button data-testid={`button-delete-book-${book.id}`} onClick={() => handleDelete(book.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.books.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No books found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
