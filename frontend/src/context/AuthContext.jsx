import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, loginUser, logoutUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleAuthFail = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  // INIT AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => handleAuthFail()) // 👉 EZ A LÉNYEG
      .finally(() => setLoading(false));
  }, []);

  const register = async (data) => {
    const res = await registerUser(data);
    return res.data;
  };

  const login = async (data) => {
    const res = await loginUser(data);

    setUser(res.data.user);
    localStorage.setItem("accessToken", res.data.accessToken);

    return res.data;
  };

  const logout = async () => {
    await logoutUser();
    handleAuthFail();
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
