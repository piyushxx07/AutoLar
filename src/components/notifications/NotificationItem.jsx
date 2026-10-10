import React from 'react';
import { Card } from 'react-bootstrap';
import { Activity, AlertTriangle, BellRing, Clock3, Lightbulb } from 'lucide-react';

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
  const TypeIcon = type === 'alert' ? AlertTriangle : type === 'info' ? Lightbulb : type === 'system' ? Activity : BellRing;
  const displayTime = new Date(timestamp);

  return (
    <Card className={`notification-card mb-2 ${getBorderClass(type)}`}>
      <Card.Body className="notification-card-body">
        <div className="notification-card-content">
          <div className="notification-card-heading">
            <span className="notification-type-icon"><TypeIcon size={17} strokeWidth={2} /></span>
            <div className="notification-title-wrap">
              <h6 className="card-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h6>
              {!read && <span className="notification-new-badge">New</span>}
            </div>
          </div>
          <p className="card-text">{message}</p>
          <small className="notification-timestamp"><Clock3 size={13} />{Number.isNaN(displayTime.getTime()) ? 'Time unavailable' : displayTime.toLocaleString()}</small>
        </div>
        {!read && <button type="button" className="btn btn-sm btn-outline-primary notification-mark-read" onClick={() => onMarkRead(id)}>Mark as read</button>}
      </Card.Body>
    </Card>
  );
};

export default NotificationItem;
