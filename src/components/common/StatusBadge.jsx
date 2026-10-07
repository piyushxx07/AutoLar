import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status, label }) => {
  const getVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
      case 'on':
        return 'success';
      case 'offline':
      case 'inactive':
      case 'off':
        return 'danger';
      case 'warning':
      case 'alert':
        return 'warning';
      case 'info':
        return 'info';
      case 'secondary':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant(status)} className="me-1">
      {label}
    </Badge>
  );
};

export default StatusBadge;