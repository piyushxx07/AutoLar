import React, { useMemo, useState } from 'react';
import { Tabs, Tab, ListGroup, Button } from 'react-bootstrap';
import NotificationItem from './NotificationItem';
import { useDevice } from '../../context/DeviceContext';
import useLatestTelemetry from '../../hooks/useLatestTelemetry';
import useRecommendation from '../../hooks/useRecommendation';

const storedIds = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const NotificationPanel = () => {
  const { deviceId } = useDevice();
  const { data: telemetry, isOnline, error: telemetryError } = useLatestTelemetry(deviceId);
  const { data: recommendation, error: recommendationError } = useRecommendation(deviceId);
  const [activeTab, setActiveTab] = useState('all');
  const [revision, setRevision] = useState(0);

  const notifications = useMemo(() => {
    const readIds = new Set(storedIds('autolar-read-notifications'));
    const hiddenIds = new Set(storedIds('autolar-hidden-notifications'));
    const items = [];
    if (telemetry) {
      const id = `${deviceId}:telemetry:${telemetry.recordedAt || 'latest'}`;
      items.push({
        id,
        type: isOnline ? 'system' : 'alert',
        message: isOnline ? `Latest telemetry received from ${deviceId}.` : `The latest ${deviceId} reading is stale; the dashboard is showing saved data.`,
        timestamp: telemetry.recordedAt || new Date().toISOString(),
        read: readIds.has(id),
      });
    } else if (telemetryError) {
      const id = `${deviceId}:telemetry-unavailable`;
      items.push({ id, type: 'alert', message: `The latest telemetry request for ${deviceId} did not return data.`, timestamp: new Date().toISOString(), read: readIds.has(id) });
    }

    if (recommendation) {
      const timestamp = recommendation.createdAt || recommendation.recordedAt || new Date().toISOString();
      const id = `${deviceId}:recommendation:${recommendation.id ?? timestamp}`;
      const detail = recommendation.reason || recommendation.mlExplanation || 'The API returned an updated tracker recommendation.';
      items.push({ id, type: 'info', message: `${recommendation.recommendedMode || 'Tracker'} recommendation: ${detail}`, timestamp, read: readIds.has(id) });
    } else if (recommendationError) {
      const id = `${deviceId}:recommendation-unavailable`;
      items.push({ id, type: 'system', message: `No recommendation is currently available for ${deviceId}.`, timestamp: new Date().toISOString(), read: readIds.has(id) });
    }
    return items.filter((item) => !hiddenIds.has(item.id)).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  }, [deviceId, telemetry, isOnline, telemetryError, recommendation, recommendationError, revision]);

  const filteredItems = activeTab === 'all' ? notifications : notifications.filter((item) => item.type === activeTab);
  const saveIds = (key, ids) => localStorage.setItem(key, JSON.stringify([...ids]));
  const markAllAsRead = () => {
    const readIds = new Set(storedIds('autolar-read-notifications'));
    notifications.forEach((item) => readIds.add(item.id));
    saveIds('autolar-read-notifications', readIds);
    setRevision((value) => value + 1);
  };
  const markAsRead = (id) => {
    const readIds = new Set(storedIds('autolar-read-notifications'));
    readIds.add(id);
    saveIds('autolar-read-notifications', readIds);
    setRevision((value) => value + 1);
  };
  const clearAll = () => {
    const hiddenIds = new Set(storedIds('autolar-hidden-notifications'));
    notifications.forEach((item) => hiddenIds.add(item.id));
    saveIds('autolar-hidden-notifications', hiddenIds);
    setRevision((value) => value + 1);
  };

  return <>
    <Tabs activeKey={activeTab} onSelect={(key) => key && setActiveTab(key)} className="notification-tabs mb-4">
      <Tab eventKey="all" title="All" /><Tab eventKey="alert" title="Alerts" /><Tab eventKey="info" title="Recommendations" /><Tab eventKey="system" title="System" />
    </Tabs>
    <ListGroup className="list-group-flush">
      {filteredItems.map((notification) => <NotificationItem key={notification.id} notification={notification} onMarkRead={markAsRead} />)}
      {filteredItems.length === 0 && <ListGroup.Item className="notification-empty-state">No cloud-backed events in this view yet.</ListGroup.Item>}
    </ListGroup>
    <div className="notification-actions d-flex justify-content-end">
      <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
      <Button variant="outline-secondary" size="sm" onClick={clearAll}>Clear visible events</Button>
    </div>
  </>;
};

export default NotificationPanel;
