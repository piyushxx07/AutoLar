import React from 'react';
import { Card } from 'react-bootstrap';

const NotificationItem = ({ notification, onMarkRead }) => {
  const { id, type, message, timestamp, read } = notification;

  const getBorderClass = (type) => {
    switch (type) {
      case 'alert': return 'notification-alert';
      case 'info': return 'notification-info';
      case 'system': return 'notification-system';
      default: return 'notification-ai';
    }
  };

  return (
    <Card className={`notification-card mb-2 ${getBorderClass(type)}`}>
      <Card.Body className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <h6 className="card-title">
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {!read && <span className="badge bg-danger ms-2">NEW</span>}
          </h6>
          <p className="card-text mb-1">{message}</p>
          <small className="text-muted">{new Date(timestamp).toLocaleString()}</small>
        </div>
        <div>
          {!read && (
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onMarkRead(id)}>
              Mark as Read
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotificationItem;
