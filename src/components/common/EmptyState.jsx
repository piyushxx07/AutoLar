import React from 'react';
import { Card } from 'react-bootstrap';
import { Info } from 'lucide-react';

const EmptyState = ({ message = 'No data available', actionText, onAction }) => {
  return (
    <Card className="text-center">
      <Card.Body>
        <Info size={48} color="#64748b" />
        <h4 className="mt-3">{message}</h4>
        {actionText && onAction && (
          <button className="btn btn-outline-secondary mt-3" onClick={onAction}>
            {actionText}
          </button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;