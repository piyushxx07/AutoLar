import React, { useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { useDevice } from '../context/DeviceContext';
import useLatestTelemetry from '../hooks/useLatestTelemetry';
import useRecommendation from '../hooks/useRecommendation';
import deviceApi from '../api/deviceApi';

export default function Assistant() {
  const { deviceId } = useDevice();
  const { data: telemetry, loading: telemetryLoading, error: telemetryError, isOnline } = useLatestTelemetry(deviceId);
  const { data: recommendation, loading, error } = useRecommendation(deviceId);
  const [applying, setApplying] = useState(false);
  const [notice, setNotice] = useState('');
  const confidence = recommendation?.confidenceScore;
  const confidencePercent = confidence == null ? null : Math.round(confidence <= 1 ? confidence * 100 : confidence);
  const applyRecommendation = async () => {
    if (!recommendation?.recommendedMode) return;
    setApplying(true); setNotice('');
    try {
      await deviceApi.setMode(deviceId, recommendation.recommendedMode);
      setNotice(`The ${recommendation.recommendedMode} command was sent to ${deviceId}.`);
    } catch {
      setNotice('Could not send the mode command. Check the cloud API connection and try again.');
    } finally { setApplying(false); }
  };
  return <div className="feature-page assistant-page">
    <SectionHeader title="Solar Assistant" subtitle={`Live guidance for ${deviceId}`} />
    {notice && <Alert variant={notice.startsWith('Could') ? 'danger' : 'success'}>{notice}</Alert>}
    <Row className="g-4">
      <Col lg={7}><Card className="h-100"><Card.Header className="d-flex align-items-center gap-2"><Bot size={20}/><strong>Recommendation from your cloud</strong><Button variant="link" className="ms-auto p-1" onClick={() => window.location.reload()} aria-label="Refresh assistant"><RefreshCw size={17}/></Button></Card.Header><Card.Body>
        {loading ? <div className="text-center p-4"><Spinner/></div> : !recommendation ? <Alert variant="warning" className="mb-0">Could not load a recommendation. Confirm the cloud API address in Settings and that this device has recommendation data.</Alert> : <>
          {error && <Alert variant="light" className="mb-3">Showing the last recommendation saved in this browser.</Alert>}
          <div className="d-flex align-items-center gap-2 mb-3"><Sparkles size={20} className="text-primary"/><h3 className="h4 mb-0">{recommendation.recommendedMode} mode</h3></div>
          <p>{recommendation.reason || 'The cloud has not supplied a reason for this recommendation.'}</p>
          {recommendation.mlExplanation && <p className="text-muted">{recommendation.mlExplanation}</p>}
          <div className="small text-muted mb-3">Confidence: {confidencePercent != null ? `${confidencePercent}%` : 'Not provided'}{recommendation.weatherSummary ? ` · ${recommendation.weatherSummary}` : ''}</div>
          <Button onClick={applyRecommendation} disabled={applying}>{applying ? 'Sending command…' : `Apply ${recommendation.recommendedMode} mode`}</Button>
        </>}
      </Card.Body></Card></Col>
      <Col lg={5}><Card className="h-100"><Card.Header><strong>What the assistant sees</strong></Card.Header><Card.Body>
        {telemetryLoading ? <Spinner size="sm"/> : !telemetry ? <p className="text-muted mb-0">No telemetry reading is available yet. Check the API address and device connection.</p> : <>
          <p className="text-muted">{!isOnline || telemetryError ? 'Last saved device reading · Offline' : 'Latest device reading'}</p>
          <dl className="row mb-0"><dt className="col-7">Power</dt><dd className="col-5">{telemetry.calculatedPowerW ?? '—'} W</dd><dt className="col-7">Panel voltage</dt><dd className="col-5">{telemetry.panelVoltage ?? '—'} V</dd><dt className="col-7">Current</dt><dd className="col-5">{telemetry.panelCurrentMa ?? '—'} mA</dd><dt className="col-7">Panel position</dt><dd className="col-5">{telemetry.servoPan ?? '—'}° / {telemetry.servoTilt ?? '—'}°</dd><dt className="col-7">Reading time</dt><dd className="col-5">{telemetry.recordedAt ? new Date(telemetry.recordedAt).toLocaleString() : '—'}</dd></dl>
        </>}
      </Card.Body></Card></Col>
    </Row>
  </div>;
}
