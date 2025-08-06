// src/components/templates/ClassicTemplate.jsx
import React from 'react';

const ClassicTemplate = ({ data, color, sectionOrder }) => {
  const renderSection = (section) => {
    switch (section) {
      case 'summary':
        return (
          <>
            <h3 style={{ borderBottom: `2px solid ${color.text}` }}>Professional Summary</h3>
            <p>{data.summary}</p>
          </>
        );
      case 'experience':
        return (
          <>
            <h3 style={{ borderBottom: `2px solid ${color.text}` }}>Work Experience</h3>
            <p>{data.experience}</p>
          </>
        );
      case 'education':
        return (
          <>
            <h3 style={{ borderBottom: `2px solid ${color.text}` }}>Education</h3>
            <p>{data.education}</p>
          </>
        );
      case 'skills':
        return (
          <>
            <h3 style={{ borderBottom: `2px solid ${color.text}` }}>Skills</h3>
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
        fontFamily: 'Georgia, serif',
        backgroundColor: color.background,
        color: color.text,
        padding: '30px',
        lineHeight: '1.6',
        borderRadius: '10px'
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${color.text}`, paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>{data.fullName}</h1>
        <p style={{ fontSize: '14px' }}>{data.email} | {data.phone}</p>
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

export default ClassicTemplate;
