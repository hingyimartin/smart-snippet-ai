import api from "./authApi";

export const fetchUsage = () => api.get("/ai/usage");
