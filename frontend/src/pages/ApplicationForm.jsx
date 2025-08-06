import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // ✅ Import context
import './ApplicationForm.css'; // ✅ Import CSS for styling

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { userData, token } = useContext(AppContext); // ✅ Get userData and token

  const [formInput, setFormInput] = useState({
    phone: '',
    coverLetter: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormInput({ ...formInput, resume: files[0] });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formInput.resume) {
      toast.error('Please upload your resume');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', userData?.name || '');
    formData.append('email', userData?.email || '');
    formData.append('phone', formInput.phone);
    formData.append('coverLetter', formInput.coverLetter);
    formData.append('resume', formInput.resume);
    formData.append('jobId', jobId);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const res = await axios.post("http://localhost:4000/api/job/apply", formData, config);

      if (res.data.success) {
        toast.success('Application submitted successfully!');
        setFormInput({
          phone: '',
          coverLetter: '',
          resume: null,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Not Authorized. Please login again.");
      } else {
        toast.error("Submission failed");
      }
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="d-flex" style={{ marginTop: '70px' }}>
      <Sidebar />
      <div className="container p-4 w-100 bg-light">
        <h3 className="mb-4">Job Application Form</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* ✅ Full Name (read-only from userData) */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={userData?.name || ''}
              readOnly
            />
          </div>

          {/* ✅ Email (read-only from userData) */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={userData?.email || ''}
              readOnly
            />
          </div>

          {/* ✅ Phone */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formInput.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ Cover Letter */}
          <div className="mb-3">
            <label className="form-label">Cover Letter</label>
            <textarea
              className="form-control"
              name="coverLetter"
              value={formInput.coverLetter}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* ✅ Resume Upload */}
          <div className="mb-3">
            <label className="form-label">Upload Resume</label>
            <input
              type="file"
              className="form-control"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
