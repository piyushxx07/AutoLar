import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default LoadingSpinner;