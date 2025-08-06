// src/components/templates/MinimalTemplate.jsx
import React from 'react';

const MinimalTemplate = ({ data, color, sectionOrder }) => {
  const renderSection = (section) => {
    switch (section) {
      case 'summary':
        return (
          <>
            <h4>Summary</h4>
            <p>{data.summary}</p>
          </>
        );
      case 'experience':
        return (
          <>
            <h4>Experience</h4>
            <p>{data.experience}</p>
          </>
        );
      case 'education':
        return (
          <>
            <h4>Education</h4>
            <p>{data.education}</p>
          </>
        );
      case 'skills':
        return (
          <>
            <h4>Skills</h4>
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
        fontFamily: 'Helvetica, sans-serif',
        backgroundColor: color.background,
        color: color.text,
        padding: '20px',
        border: `1px solid ${color.text}`,
        borderRadius: '5px',
        lineHeight: '1.5'
      }}
    >
      {/* Header */}
      <h2 style={{ marginBottom: '5px' }}>{data.fullName}</h2>
      <small>{data.email} | {data.phone}</small>
      <hr style={{ borderColor: color.text, margin: '15px 0' }} />

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionKey, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          {renderSection(sectionKey)}
        </div>
      ))}
    </div>
  );
};

export default MinimalTemplate;
