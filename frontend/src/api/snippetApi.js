import api from "./authApi";

export const fetchSnippets = () => api.get("/snippets");
export const fetchSnippetById = (id) => api.get(`/snippets/${id}`);
export const createSnippet = (data) => api.post("/snippets", data);
export const updateSnippet = (id, data) => api.put(`/snippets/${id}`, data);
export const deleteSnippet = (id) => api.delete(`/snippets/${id}`);
export const fetchPublicSnippets = () => api.get("/snippets/explore");

export const voteSnippet = (id, vote_type) =>
  api.post(`/snippets/${id}/vote`, { vote_type });
