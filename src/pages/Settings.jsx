import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import SectionHeader from '../components/common/SectionHeader';
import { useDevice } from '../context/DeviceContext';
import { getApiBaseUrl, setApiBaseUrl } from '../api/axiosClient';

const Settings = () => {
  const { deviceId, setDeviceId } = useDevice();
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [deviceIdDraft, setDeviceIdDraft] = useState(deviceId);
  const [status, setStatus] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setApiUrl(setApiBaseUrl(apiUrl));
      setDeviceId(deviceIdDraft);
      setStatus({ variant: 'success', message: 'Cloud API and device settings saved in this browser.' });
    } catch (error) {
      setStatus({ variant: 'danger', message: error.message || 'Enter a valid API address.' });
    }
  };

  return (
    <div className="feature-page settings-page">
      <SectionHeader title="Settings" subtitle="Connect this browser to your Spring Boot device API" />
      {status && <Alert variant={status.variant} className="mb-4" role="status">{status.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Card className="settings-connection-card mb-3">
          <Card.Header><h5 className="card-title">Cloud connection</h5></Card.Header>
          <Card.Body>
            <Form.Group controlId="apiUrl" className="mb-3">
              <Form.Label>Cloud API address</Form.Label>
              <Form.Control type="text" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} required placeholder="/api or https://api.example.com/api" />
              <Form.Text>Use /api for this site’s Vercel proxy, or an HTTPS API address. This is saved in this browser.</Form.Text>
            </Form.Group>
            <Form.Group controlId="deviceId">
              <Form.Label>Device ID</Form.Label>
              <Form.Control value={deviceIdDraft} onChange={(event) => setDeviceIdDraft(event.target.value)} required maxLength={120} placeholder="esp32_tracker_01" />
              <Form.Text>This ID is inserted into the latest, telemetry, recommendation, and mode API routes.</Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="settings-save-row"><Button type="submit" variant="primary">Save connection</Button></div>
      </Form>
    </div>
  );
};

export default Settings;
