import { queryClient } from "./queryClient";

async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || "Request failed");
  }
  return res.json();
}

export const api = {
  getBooks: (query?: string, language?: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (language) params.set("language", language);
    const qs = params.toString();
    return apiRequest(`/api/books${qs ? `?${qs}` : ""}`);
  },
  getEvents: () => apiRequest("/api/events"),
  getBlogPosts: () => apiRequest("/api/blog"),
  getPodcasts: () => apiRequest("/api/podcasts"),
  getLivestreams: () => apiRequest("/api/livestreams"),
  subscribeNewsletter: (email: string) =>
    apiRequest("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) }),
  submitPrayerRequest: (data: any) =>
    apiRequest("/api/prayer-requests", { method: "POST", body: JSON.stringify(data) }),
  submitPastorApplication: (data: any) =>
    apiRequest("/api/pastor-applications", { method: "POST", body: JSON.stringify(data) }),
  submitContactMessage: (data: any) =>
    apiRequest("/api/contact", { method: "POST", body: JSON.stringify(data) }),
  submitEvent: (data: any) =>
    apiRequest("/api/events", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) =>
    apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) =>
    apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
};
