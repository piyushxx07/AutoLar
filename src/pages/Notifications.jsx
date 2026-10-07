import React from 'react';
import NotificationPanel from '../components/notifications/NotificationPanel';
import SectionHeader from '../components/common/SectionHeader';

const Notifications = () => {
  return (
    <div className="feature-page notifications-page">
      <SectionHeader title="Notifications" subtitle="Alerts and updates for your solar tracker" />
      <div className="notifications-surface"><NotificationPanel /></div>
    </div>
  );
};

export default Notifications;
