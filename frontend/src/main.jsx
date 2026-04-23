import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

import Layout from './components/layout/Layout'
import Landing from './pages/Landing'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)