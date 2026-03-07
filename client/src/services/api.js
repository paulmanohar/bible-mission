const BASE_URL = "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("bm_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiRequest(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || "Request failed");
  }
  return res.json();
}

export const apiService = {
  // Books
  getBooks(query, language) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (language) params.set("language", language);
    const qs = params.toString();
    return apiRequest(`/books${qs ? `?${qs}` : ""}`);
  },
  getBook(id) {
    return apiRequest(`/books/${id}`);
  },

  // Events
  getEvents() {
    return apiRequest("/events");
  },
  getEvent(id) {
    return apiRequest(`/events/${id}`);
  },
  submitEvent(data) {
    return apiRequest("/events", { method: "POST", body: JSON.stringify(data) });
  },

  // Blog
  getBlogPosts() {
    return apiRequest("/blog");
  },
  getBlogPost(slug) {
    return apiRequest(`/blog/${slug}`);
  },

  // Podcasts & Livestreams
  getPodcasts() {
    return apiRequest("/podcasts");
  },
  getPodcast(id) {
    return apiRequest(`/podcasts/${id}`);
  },
  getLivestreams() {
    return apiRequest("/livestreams");
  },
  getBlogPostById(id) {
    return apiRequest(`/blog/id/${id}`);
  },

  // Forms
  subscribeNewsletter(email) {
    return apiRequest("/newsletter", { method: "POST", body: JSON.stringify({ email }) });
  },
  submitPrayerRequest(data) {
    return apiRequest("/prayer-requests", { method: "POST", body: JSON.stringify(data) });
  },
  submitPastorApplication(data) {
    return apiRequest("/pastor-applications", { method: "POST", body: JSON.stringify(data) });
  },
  submitContactMessage(data) {
    return apiRequest("/contact", { method: "POST", body: JSON.stringify(data) });
  },

  // Global Search
  globalSearch({ query, types, categories, tags, author, sort, page, limit }) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (types && types.length) params.set("types", types.join(","));
    if (categories && categories.length) params.set("categories", categories.join(","));
    if (tags && tags.length) params.set("tags", tags.join(","));
    if (author) params.set("author", author);
    if (sort) params.set("sort", sort);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return apiRequest(`/search${qs ? `?${qs}` : ""}`);
  },

  // Auth
  register(data) {
    return apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });
  },
  login(data) {
    return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) });
  },
  forgotPassword(email) {
    return apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
  },
  resetPassword(token, newPassword) {
    return apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) });
  },
  getProfile() {
    return apiRequest("/auth/me");
  },
  updateProfile(data) {
    return apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(data) });
  },
  changePassword(currentPassword, newPassword) {
    return apiRequest("/auth/change-password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
  },
};
