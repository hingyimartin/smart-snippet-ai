import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Snippets from "./pages/Snippets";
import Explore from "./pages/Explore";
import SnippetNew from "./pages/SnippetNew";
import SnippetEdit from "./pages/SnippetEdit";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import Sitemap from "./pages/Sitemap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<Explore />} />
              <Route
                path="/snippets"
                element={
                  <ProtectedRoute>
                    <Snippets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/snippets/new"
                element={
                  <ProtectedRoute>
                    <SnippetNew />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/snippets/:id/edit"
                element={
                  <ProtectedRoute>
                    <SnippetEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/sitemap" element={<Sitemap />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
