import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const backendUrl = 'http://localhost:4000';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/job/job-lists`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setJobs(data.jobs);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching jobs");
        console.error("Fetch error:", error.response?.data || error.message);
      }
    };

    fetchJobs();
  }, [token]);

  const handleApply = (jobId) => {
    if (!token) {
      toast.info("Please log in to apply for this job.");
      navigate('/login');
    } else {
      navigate(`/jobs/${jobId}/apply`);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    [job.title, job.experience, job.qualification, job.techStack]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="d-flex" style={{ marginTop: '70px', minHeight: '100vh' }}>
      <Sidebar />

      <div className="p-4 w-100 bg-light">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="fw-bold text-primary">Available Job Opportunities</h2>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by title, experience, qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="alert alert-info shadow-sm">
            <strong>No job listings found.</strong> Please try using different search terms.
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th>Job Title</th>
                      <th>Experience</th>
                      <th>Qualification</th>
                      <th>Date Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.experience}</td>
                        <td>{job.qualification}</td>
                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() => setSelectedJob(job)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            onClick={() => handleApply(job._id)}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedJob.title} – Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedJob(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Description:</strong></p>
                  <p>{selectedJob.description}</p>
                  <hr />
                  <p><strong>Requirements / Tech Stack:</strong></p>
                  <p>{selectedJob.techStack}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(selectedJob._id)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
