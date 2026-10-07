import React from 'react';
const SectionHeader = ({ title, icon, subtitle }) => {
  return (
    <div className="page-heading">
      {icon && <span className="me-2">{icon}</span>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
