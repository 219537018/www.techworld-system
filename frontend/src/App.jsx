import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import MyJobApplications from './pages/MyJobApplications';
import JobApplicationForm from './pages/ApplicationForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProvider from './context/AppContext';
import ResumeBuilder from './pages/ResumeBuilder';
// ✅ Import your context provider

const App = () => {
  return (
    <AppContextProvider>
      <div className="d-flex flex-column min-vh-100" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <ToastContainer />
        <header>
          <Navbar />
        </header>

        <main className="flex-grow-1 pt-4 px-3 bg-light">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-job-applications" element={<MyJobApplications />} />
            <Route path="/jobs/:jobId/apply" element={<JobApplicationForm />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/*" element={<NotFound />} />

          </Routes>
        </main>

        <footer className="bg-white shadow p-3 mt-auto">
          <Footer />
        </footer>
      </div>
    </AppContextProvider>
  );
};

export default App;
