import api from "./authApi";

export const fetchStats = () => api.get("/admin/stats");
export const fetchUsers = () => api.get("/admin/users");
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const fetchAdminSnippets = () => api.get("/admin/snippets");
export const deleteAdminSnippet = (id) => api.delete(`/admin/snippets/${id}`);
export const toggleVisibility = (id) =>
  api.put(`/admin/snippets/${id}/visibility`);
