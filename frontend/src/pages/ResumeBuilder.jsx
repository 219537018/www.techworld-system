// src/pages/ResumeBuilder.jsx
import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const resumeRef = useRef();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    jobDescription: '',
    template: 'classic',
  });

  const [sectionOrder, setSectionOrder] = useState(['summary', 'experience', 'education', 'skills']);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateSelect = (templateName) => {
    setFormData({ ...formData, template: templateName });
    setShowPreview(false); // reset preview to encourage regenerating
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(sectionOrder);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSectionOrder(reordered);
  };

  const handleGenerateResume = () => {
    if (!formData.fullName || !formData.jobDescription) {
      alert('Please enter your name and job description before generating the resume.');
      return;
    }
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    if (!showPreview) {
      alert('Generate the resume before downloading.');
      return;
    }
    const element = resumeRef.current;
    const opt = {
      margin: 0.5,
      filename: `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    import('html2pdf.js').then(html2pdf => {
      html2pdf.default().set(opt).from(element).save();
    });
  };

  const getTemplateComponent = () => {
    const templates = {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate
    };
    return templates[formData.template] || ClassicTemplate;
  };

  const SelectedTemplate = getTemplateComponent();
  const colorTheme = { background: '#ffffff', text: '#000000' };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: '250px', minHeight: '100vh' }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <div className="container-fluid">
          <h2 className="mb-4">📄 AI-Powered Resume Builder</h2>

          <div className="row">
            {/* Form Section */}
            <div className="col-md-6">
              <form>
                <input type="text" name="fullName" placeholder="Full Name" className="form-control mb-2" onChange={handleChange} value={formData.fullName} />
                <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} value={formData.email} />
                <input type="text" name="phone" placeholder="Phone" className="form-control mb-2" onChange={handleChange} value={formData.phone} />
                <textarea name="summary" placeholder="Professional Summary" className="form-control mb-2" onChange={handleChange} value={formData.summary} />
                <textarea name="experience" placeholder="Work Experience" className="form-control mb-2" onChange={handleChange} value={formData.experience} />
                <textarea name="education" placeholder="Education" className="form-control mb-2" onChange={handleChange} value={formData.education} />
                <textarea name="skills" placeholder="Skills (comma separated)" className="form-control mb-2" onChange={handleChange} value={formData.skills} />
                <textarea name="jobDescription" placeholder="Paste Job Description Here" className="form-control mb-3" onChange={handleChange} value={formData.jobDescription} />

                {/* Template Selection */}
                <div className="mt-4">
                  <h5>Select a Resume Template</h5>
                  <div className="d-flex gap-3 mt-3 flex-wrap">
                    {['classic', 'modern', 'minimal'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={`btn btn-outline-secondary ${formData.template === key ? 'active' : ''}`}
                        onClick={() => handleTemplateSelect(key)}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button type="button" className="btn btn-primary mt-4 w-100" onClick={handleGenerateResume}>
                  Generate Resume
                </button>
              </form>
            </div>

            {/* Resume Preview */}
            <div className="col-md-6">
              <div className="resume-preview bg-white border rounded p-3">
                <h5 className="mb-3">Resume Preview</h5>

                {showPreview ? (
                  <div ref={resumeRef}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="sections">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            <SelectedTemplate
                              data={formData}
                              color={colorTheme}
                              sectionOrder={sectionOrder}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                ) : (
                  <p className="text-muted">Click "Generate Resume" to preview it here.</p>
                )}

                <button className="btn btn-success mt-3 w-100" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
