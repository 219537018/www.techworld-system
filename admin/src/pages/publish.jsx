import React, { useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import './AddJob.css';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('Full Stack');
  const [qualification, setQualification] = useState('');
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('experience', experience);
      formData.append('salary', Number(salary));
      formData.append('description', description);
      formData.append('techStack', techStack);
      formData.append('qualification', qualification);
      formData.append('location', JSON.stringify({ line1: location1, line2: location2 }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-job`, formData, {
        headers: { aToken },
      });

      if (data.success) {
        toast.success(data.message || 'Job added successfully');
        // Clear form fields
        setTitle('');
        setExperience('1 Year');
        setSalary('');
        setDescription('');
        setTechStack('Full Stack');
        setQualification('');
        setLocation1('');
        setLocation2('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '2rem', backgroundColor: '#f9fafb' }}>
        <style>{`
          .add-job-form {
            margin: 0 auto;
            width: 100%;
          }

          /* Entire page layout */
          .add-job-page {
            display: flex;
            min-height: 100vh;
            background-color:rgb(224, 242, 237); /* ✅ You can change this color as needed */
          }

         
          .add-job-form p.title {
            margin-bottom: 1rem;
            font-size: 1.25rem;
            font-weight: 500;
          }

          .add-job-container {
            background-color: #fff;
            padding: 2rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            width: 100%;
            max-width: 1000px;
            max-height: 80vh;
            overflow-y: auto;
          }

          .form-row {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            color: #4b5563;
          }

          @media(min-width: 1024px) {
            .form-row {
              flex-direction: row;
              align-items: flex-start;
            }
          }

          .form-col {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 1rem;
          }

          .form-group textarea {
            resize: vertical;
          }

          .submit-btn {
            margin-top: 1.5rem;
            padding: 0.75rem 2.5rem;
            background-color: #2563eb;
            color: white;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
          }

          .submit-btn:hover {
            background-color: #1d4ed8;
          }
        `}</style>

        <form onSubmit={onSubmitHandler} className="add-job-form">
          <p className="title">Add Software Developer Job</p>

          <div className="add-job-container">
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <p>Job Title</p>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="Software Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <p>Experience</p>
                  <select
                    onChange={(e) => setExperience(e.target.value)}
                    value={experience}
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="6+ Years">6+ Years</option>
                  </select>
                </div>

                <div className="form-group">
                  <p>Salary (Monthly)</p>
                  <input
                    onChange={(e) => setSalary(e.target.value)}
                    value={salary}
                    type="number"
                    placeholder="Salary in Rs"
                    required
                  />
                </div>
              </div>

              <div className="form-col">
                <div className="form-group">
                  <p>Tech Stack</p>
                  <select
                    onChange={(e) => setTechStack(e.target.value)}
                    value={techStack}
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                  </select>
                </div>

                <div className="form-group">
                  <p>Qualification</p>
                  <input
                    onChange={(e) => setQualification(e.target.value)}
                    value={qualification}
                    type="text"
                    placeholder="BSc in Computer Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <p>Location</p>
                  <input
                    onChange={(e) => setLocation1(e.target.value)}
                    value={location1}
                    type="text"
                    placeholder="City"
                    required
                  />
                  <input
                    onChange={(e) => setLocation2(e.target.value)}
                    value={location2}
                    type="text"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <p className="mt-4 mb-2">Job Description</p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                rows={5}
                placeholder="Describe the role, responsibilities, and requirements"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Post Job
            </button>
          </div>
        </form>

        {/* Toast container for success/error messages */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
      </div>
    </div>
  );
};

export default AddJob;
