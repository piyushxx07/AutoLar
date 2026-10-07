import React from 'react';
import { Card } from 'react-bootstrap';

const LdrSensorCard = ({ latestTelemetry, isOnline }) => {
  const tl = latestTelemetry ? latestTelemetry.ldrTopLeft : 0;
  const tr = latestTelemetry ? latestTelemetry.ldrTopRight : 0;
  const bl = latestTelemetry ? latestTelemetry.ldrBottomLeft : 0;
  const br = latestTelemetry ? latestTelemetry.ldrBottomRight : 0;

  return (
    <Card className="ldr-sensor-card h-100">
      <Card.Body className="p-3">
        <div className="text-muted fw-semibold small text-uppercase text-center mb-2" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>LDR Sensors</div>
        {latestTelemetry ? (
          <div className="d-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.3rem 0.5rem' }}>
            {[['Top left', tl], ['Top right', tr], ['Bottom left', bl], ['Bottom right', br]].map(([label, value]) => (
              <div key={label} className="d-flex flex-column align-items-center">
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>{label}</span>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{value ?? '—'}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="telemetry-not-reported text-center small mb-0">Not reported</p>
        )}
        {!isOnline && latestTelemetry && <p className="text-warning text-center small mt-2 mb-0">Last reading · Offline</p>}
      </Card.Body>
    </Card>
  );
};

export default LdrSensorCard;
