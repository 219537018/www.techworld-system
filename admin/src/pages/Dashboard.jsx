import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';




const Dashboard = () => {
  const { aToken, applications, getAllApplications } = useContext(AdminContext); // ✅ Get shared state
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null); // State to manage job editing

  const backendUrl = 'http://localhost:4000'; // Change this to your deployed backend URL if needed

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/get-jobs`, {
          headers: { aToken },
        });

        if (data.success) {
          setJobs(data.jobs);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching jobs");
        console.error(error);
      }
    };

    fetchJobs();
    getAllApplications(); // ✅ Load applications via context
  }, [aToken, getAllApplications]);

  const handleDelete = async (jobId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/delete-job/${jobId}`, {
        headers: { aToken },
      });
  
      if (data.success) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        toast.success('Job deleted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };
  


  const handleEdit = (job) => {
    setEditingJob(job); // Set the job to be edited
  };

  const saveEditedJob = async (updatedJob) => {
    try {
        const { data } = await axios.put(`${backendUrl}/api/job/edit-job/${updatedJob._id}`, updatedJob, {
            headers: { aToken }, // Include authentication token
        });

        if (data.success) {
            setJobs((prevJobs) =>
                prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
            );
            toast.success('Job updated successfully');
            setEditingJob(null); // Clear editing state
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error('Error updating job:', error);
        toast.error('Failed to update job');
    }
};
  return (
    <div className="dashboard-container" style={{ display: 'flex' }}>
      <Sidebar />

      <div className="dashboard-content">
        <h3>Welcome to Admin Dashboard</h3>
        <p>This is your main admin dashboard content.</p>

        {/* Job Stats */}
        <div className="card mt-4 p-3">
          <h5>Total Published Jobs: {jobs.length}</h5>
        </div>

        {/* Applicant Stats */}
        <div className="card mt-4 p-3">
          <h5>Total Applicants: {applications.length}</h5> {/* ✅ Uses shared context data */}
        </div>

  


        {/* Jobs Table */}
        <div className="card mt-4 p-3">
          <h5>Recent Job Posts</h5>
          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Experience</th>
                  <th>Job Description</th>
                  <th>Qualification</th>
                  <th>Requirement</th>
                  <th>Actions</th>
                 
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 9).map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.experience}</td>
                    <td>{job.description}</td>
                    <td>{job.qualification}</td>
                    <td>{job.techStack}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>
                      <span style={{ color: '#6c757d' }}>/</span> {/* Divider */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
          {/* Edit Job Modal */}
          {editingJob && (
            <div className="custom-modal-overlay">
              <div className="custom-modal-content">
                <h5>Edit Job</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEditedJob(editingJob);
                  }}
                >
                  <input
                    className="form-control mb-2"
                    type="text"
                    value={editingJob.title}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, title: e.target.value })
                    }
                    placeholder="Job Title"
                  />
                  <input
                    className="form-control mb-2"
                    type="text"
                    value={editingJob.experience}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, experience: e.target.value })
                    }
                    placeholder="Experience"
                  />
                  <textarea
                    className="form-control mb-2"
                    value={editingJob.description}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, description: e.target.value })
                    }
                    placeholder="Job Description"
                  ></textarea>
                  <input
                    className="form-control mb-2"
                    type="text"
                    value={editingJob.qualification}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, qualification: e.target.value })
                    }
                    placeholder="Qualification"
                  />
                  <input
                    className="form-control mb-3"
                    type="text"
                    value={editingJob.techStack}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, techStack: e.target.value })
                    }
                    placeholder="Tech Stack"
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingJob(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


      </div>
    </div>
  );
};

export default Dashboard;
