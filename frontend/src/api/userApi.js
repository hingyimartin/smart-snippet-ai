import api from "./authApi";

export const fetchProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const changePassword = (data) => api.put("/users/password", data);
