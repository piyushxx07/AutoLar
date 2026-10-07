import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="autolar-footer">
      <Container fluid className="autolar-footer-inner">
        <p>AutoLar · Solar Tracking System</p>
        <p>Monitoring your clean energy · © {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
