import React from 'react';
import { Card } from 'react-bootstrap';
import { XOctagon } from 'lucide-react';

const ErrorState = ({ message = 'An error occurred', actionText, onAction }) => {
  return (
    <Card className="text-center">
      <Card.Body>
        <XOctagon size={48} color="#ef4444" />
        <h4 className="mt-3">{message}</h4>
        {actionText && onAction && (
          <button className="btn btn-primary mt-3" onClick={onAction}>
            {actionText}
          </button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ErrorState;