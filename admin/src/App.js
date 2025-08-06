import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/publish'
import Applicants from './pages/Applicants' // ✅ Import Applicants

function App() {
  return (
    <Router>
      {/* Always show Navbar */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/publish" element={<AddJob />} />
        <Route path="/applicants" element={<Applicants />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  )
}

export default App
