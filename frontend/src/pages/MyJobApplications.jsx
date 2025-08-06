import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import './MyJobApplications.css'; // import the CSS file

const backendUrl = "http://localhost:4000";

const MyJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(`${backendUrl}/api/user/my-applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch applications");
        }

        setApplications(response.data.applications || []);
      } catch (err) {
        setError(err.message);
        setApplications([]);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="d-flex bg-web1" style={{ marginTop: '70px' }}>
      <Sidebar />
      <div className="container p-4 w-100 bg-light bg-opacity-75 rounded">
        <h3 className="mb-4">My Job Applications</h3>

        {error && <p className="text-danger">Error: {error}</p>}

        {!error && applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-dark">
              <tr>
                <th>Job Title</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.job?.title || 'N/A'}</td>
                  <td>
                  <span className={`badge 
                    ${app.status === 'Accepted' ? 'bg-success' : 
                      app.status === 'Rejected' ? 'bg-danger' : 
                      'bg-warning text-dark'}`}>
                    {app.status || 'Pending'}
                  </span>
                  {app.reason && (
                    <div className="text-muted small mt-1">
                      <strong>Reason:</strong> {app.reason}
                    </div>
                  )}
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyJobApplications;
