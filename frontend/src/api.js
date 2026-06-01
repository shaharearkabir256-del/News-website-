import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Send cookies cross-origin if any
});

// Articles
export const articlesApi = {
  list: (params = {}) => api.get("/articles", { params }).then((r) => r.data),
  featured: () => api.get("/articles/featured").then((r) => r.data),
  trending: () => api.get("/articles/trending").then((r) => r.data),
  opinion: () => api.get("/articles/opinion").then((r) => r.data),
  videos: () => api.get("/articles/videos").then((r) => r.data),
  bySlug: (slug) => api.get(`/articles/${slug}`).then((r) => r.data),
  related: (slug, limit = 3) => api.get(`/articles/${slug}/related`, { params: { limit } }).then((r) => r.data),
  create: (data) => api.post("/articles", data).then((r) => r.data),
  update: (id, data) => api.put(`/articles/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/articles/${id}`).then((r) => r.data),
  reseed: () => api.post("/seed").then((r) => r.data),
};

// Comments
export const commentsApi = {
  list: (slug) => api.get(`/articles/${slug}/comments`).then((r) => r.data),
  create: (slug, data) => api.post(`/articles/${slug}/comments`, data).then((r) => r.data),
};

// Admin moderation
export const adminApi = {
  listAllComments: (status = null) =>
    api.get("/admin/comments", { params: status ? { status } : {} }).then((r) => r.data),
  hideComment: (id) => api.post(`/admin/comments/${id}/hide`).then((r) => r.data),
  unhideComment: (id) => api.post(`/admin/comments/${id}/unhide`).then((r) => r.data),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`).then((r) => r.data),
  bulkComments: (ids, action) =>
    api.post("/admin/comments/bulk", { ids, action }).then((r) => r.data),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api
      .post("/admin/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

// Auth
export const authApi = {
  me: () => api.get("/auth/me").then((r) => r.data),
  exchangeSession: (session_id) => api.post("/auth/session", { session_id }).then((r) => r.data),
  devLogin: (payload) => api.post("/auth/dev-login", payload).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
};

// Bookmarks
export const bookmarksApi = {
  list: () => api.get("/bookmarks").then((r) => r.data),
  slugs: () => api.get("/bookmarks/slugs").then((r) => r.data),
  toggle: (slug) => api.post(`/bookmarks/${slug}`).then((r) => r.data),
};

// Newsletter
export const newsletterApi = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }).then((r) => r.data),
  list: () => api.get("/newsletter").then((r) => r.data),
  remove: (email) => api.delete(`/newsletter/${encodeURIComponent(email)}`).then((r) => r.data),
};

// Categories + ticker
export const categoriesApi = {
  list: () => api.get("/categories").then((r) => r.data),
};

export const tickerApi = {
  list: () => api.get("/ticker").then((r) => r.data),
};

// Helper: resolve relative /api/uploads/... URLs to absolute
export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return url;
}

export default api;
