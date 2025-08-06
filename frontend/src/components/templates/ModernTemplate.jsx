// src/components/templates/ModernTemplate.jsx
import React from 'react';

const ModernTemplate = ({ data, color, sectionOrder }) => {
  const renderSection = (section) => {
    switch (section) {
      case 'summary':
        return (
          <>
            <h3 style={{ color: color.text }}>💼 Professional Summary</h3>
            <p>{data.summary}</p>
          </>
        );
      case 'experience':
        return (
          <>
            <h3 style={{ color: color.text }}>📌 Work Experience</h3>
            <p>{data.experience}</p>
          </>
        );
      case 'education':
        return (
          <>
            <h3 style={{ color: color.text }}>🎓 Education</h3>
            <p>{data.education}</p>
          </>
        );
      case 'skills':
        return (
          <>
            <h3 style={{ color: color.text }}>🛠 Skills</h3>
            <ul>
              {data.skills.split(',').map((skill, i) => (
                <li key={i}>{skill.trim()}</li>
              ))}
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: color.background,
        color: color.text,
        padding: '30px',
        borderRadius: '10px',
        lineHeight: '1.6'
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${color.text}`, marginBottom: '15px' }}>
        <h1>{data.fullName}</h1>
        <p>{data.email} | {data.phone}</p>
      </div>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionKey, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          {renderSection(sectionKey)}
        </div>
      ))}
    </div>
  );
};

export default ModernTemplate;
