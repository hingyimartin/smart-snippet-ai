import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


import './index.css'

import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Register from './pages/Register';
import Login from './pages/Login';
import Snippets from './pages/Snippets';
import Explore from './pages/Explore';
import SnippetNew from './pages/SnippetNew';
import NotFound from './pages/NotFound';
import SnippetEdit from './pages/SnippetEdit';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
            <Route path="/snippets" element={<ProtectedRoute><Snippets /></ProtectedRoute>} />
  <Route path="/snippets/new" element={<ProtectedRoute><SnippetNew /></ProtectedRoute>} />
          <Route path="/explore" element={<Explore />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/snippets/:id/edit" element={<ProtectedRoute><SnippetEdit /></ProtectedRoute>} />
        </Routes>
      </Layout>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)