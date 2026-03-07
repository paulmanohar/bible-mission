import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminBlogPosts } from "../../store/slices/adminSlice";
import { adminApiService } from "../../services/api";

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  author: "Bible Mission",
  category: "Devotional",
  published: false,
  sourceUrl: "",
  sourceType: "text",
  tags: "",
};

export default function AdminArticlesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminBlogPosts());
  }, [dispatch]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (post) => {
    setEditId(post.id);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      coverImage: post.coverImage || "",
      author: post.author || "",
      category: post.category || "",
      published: !!post.published,
      sourceUrl: post.sourceUrl || "",
      sourceType: post.sourceType || "text",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
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
        await adminApiService.adminUpdateBlogPost(editId, data);
      } else {
        await adminApiService.adminCreateBlogPost(data);
      }
      setShowForm(false);
      dispatch(fetchAdminBlogPosts());
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this article?")) return;
    try {
      await adminApiService.adminDeleteBlogPost(id);
      dispatch(fetchAdminBlogPosts());
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="text-admin-articles-title">Articles</h1>
        <button data-testid="button-add-article" onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          Add New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-article-form-title">
            {editId ? "Edit Article" : "New Article"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input data-testid="input-article-title" name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input data-testid="input-article-slug" name="slug" value={form.slug} onChange={handleChange} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input data-testid="input-article-author" name="author" value={form.author} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input data-testid="input-article-category" name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input data-testid="input-article-coverImage" name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
              <input data-testid="input-article-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
              <input data-testid="input-article-sourceType" name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
              <input data-testid="input-article-tags" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
              <textarea data-testid="input-article-excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea data-testid="input-article-content" name="content" value={form.content} onChange={handleChange} rows={6} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input data-testid="input-article-published" type="checkbox" name="published" checked={form.published} onChange={handleChange} className="rounded" />
              <label className="text-sm text-slate-700">Published</label>
            </div>
            <div />
            <div className="md:col-span-2 flex gap-3">
              <button data-testid="button-submit-article" type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button data-testid="button-cancel-article" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-slate-500" data-testid="text-loading">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-articles">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">ID</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Author</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Category</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Published</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Source Type</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.blogPosts.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`row-article-${post.id}`}>
                <td className="px-4 py-3">{post.id}</td>
                <td className="px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {post.published ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">{post.sourceType}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button data-testid={`button-edit-article-${post.id}`} onClick={() => openEdit(post)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button data-testid={`button-delete-article-${post.id}`} onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.blogPosts.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No articles found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
