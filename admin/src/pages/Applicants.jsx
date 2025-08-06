// pages/Applicants.jsx
import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import Sidebar from '../components/Sidebar';
import './Applicants.css';
import axios from 'axios';
import { toast } from 'react-toastify';


const Applicants = () => {
  const { applications, getAllApplications } = useContext(AdminContext);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    getAllApplications();
  }, [getAllApplications]);

  const analyzeResume = async (app) => {
    const resumePath = app.resume;
    const jobTitle = app.job?.title;
    const jobDescription = app.job?.description;
    const qualification = app.job?.qualification;
    const applicationId = app._id;

    console.log("Attempting to analyze resume for application ID:", applicationId);
    console.log("Resume Path:", resumePath);
    console.log("Job Title:", jobTitle);
    console.log("Job Description:", jobDescription);
    console.log("Qualification:", qualification);

    if (!resumePath || !jobDescription || !qualification || !applicationId) {
      toast.error("Missing required fields for resume analysis. Please ensure job details and resume are available.");
      console.error("Missing fields for analysis:", { resumePath, jobDescription, qualification, applicationId });
      return;
    }

    setAnalyzingId(applicationId);

    try {
      const { data } = await axios.post("http://localhost:4000/api/analyze", {
        resumePath,
        jobTitle,
        jobDescription,
        qualification,
        applicationId,
      });

      toast.success(`AI Decision: ${data.decision}. Reason: ${data.reason || 'N/A'}`);
      getAllApplications(); // Refresh applications to show updated status
    } catch (err) {
      console.error("❌ Analyze error details:", err.response?.data || err.message);
      toast.error("Failed to analyze resume. Please check server logs for details.");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="applicants-layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>

      <div className="main-content">
        <h2 className="mb-4">All Job Applications</h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Resume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td>{app.job?.title || 'N/A'}</td>
                  <td>
                    {/* Updated resume URL to a more common static serving path */}
                    <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const secureResumeUrl = `http://localhost:4000/api/resume/secure-resume/${app.resume}`;
                      console.log("Attempting to open secure resume URL:", secureResumeUrl);
                      setSelectedResume(secureResumeUrl);
                    }}
                  >
                    View Resume
                  </button>
                    <br />
                    <button
                      className="btn btn-sm btn-info mt-1"
                      onClick={() => analyzeResume(app)}
                      disabled={analyzingId === app._id}
                    >
                      {analyzingId === app._id ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </td>
                  <td>{app.status || 'Pending'}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resume Viewer Modal */}
      {selectedResume && (
        <div className="resume-modal" onClick={() => setSelectedResume(null)}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-danger btn-sm mb-2 float-end" onClick={() => setSelectedResume(null)}>
              Close
            </button>
            {/* Using iframe to display PDF, ensure the URL is directly accessible by the browser */}
            <iframe
              src={selectedResume}
              title="Applicant Resume"
              width="100%"
              height="600px"
              style={{ border: '1px solid #ccc' }}
              // Add sandbox attribute for security, allowing only necessary capabilities
              // 'allow-scripts' is often needed for PDF viewers embedded in iframes
              // 'allow-same-origin' if the PDF is from the same origin as your app
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            >
              <p>Your browser does not support iframes. You can <a href={selectedResume} target="_blank" rel="noopener noreferrer">download the resume here</a> instead.</p>
            </iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
