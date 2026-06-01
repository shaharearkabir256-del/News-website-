import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const articlesApi = {
  list: (params = {}) => api.get("/articles", { params }).then((r) => r.data),
  featured: () => api.get("/articles/featured").then((r) => r.data),
  trending: () => api.get("/articles/trending").then((r) => r.data),
  opinion: () => api.get("/articles/opinion").then((r) => r.data),
  videos: () => api.get("/articles/videos").then((r) => r.data),
  bySlug: (slug) => api.get(`/articles/${slug}`).then((r) => r.data),
  create: (data) => api.post("/articles", data).then((r) => r.data),
  update: (id, data) => api.put(`/articles/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/articles/${id}`).then((r) => r.data),
  reseed: () => api.post("/seed").then((r) => r.data),
};

export const commentsApi = {
  list: (slug) => api.get(`/articles/${slug}/comments`).then((r) => r.data),
  create: (slug, data) => api.post(`/articles/${slug}/comments`, data).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get("/categories").then((r) => r.data),
};

export const tickerApi = {
  list: () => api.get("/ticker").then((r) => r.data),
};

export default api;
