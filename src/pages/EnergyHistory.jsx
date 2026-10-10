import React, { useMemo, useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import useTelemetryHistory from '../hooks/useTelemetryHistory';
import { formatNumber, formatDate, formatTimeAgo } from '../utils/formatters';
import { Col, Row, Card, Table, InputGroup, FormControl, Form } from "react-bootstrap";
import PowerChart from '../components/charts/PowerChart';
import SectionHeader from '../components/common/SectionHeader';

const EnergyHistory = () => {
  const { deviceId } = useDevice();
  const [range, setRange] = useState('today');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calculateDateRange = () => {
    let end = new Date();
    let start;
    switch (range) {
      case 'today':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        } else {
          return { start: null, end: null };
        }
        break;
      default:
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date();
    }
    return { start, end };
  };

  const { start, end } = useMemo(calculateDateRange, [range, startDate, endDate]);
  const { data: historyData, loading, error } = useTelemetryHistory(deviceId, start, end);
  const powerValues = historyData.map((item) => item.calculatedPowerW).filter(Number.isFinite);
  const peakPower = powerValues.length ? Math.max(...powerValues) : null;
  const averagePower = powerValues.length ? powerValues.reduce((sum, value) => sum + value, 0) / powerValues.length : null;

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (e.target.value === 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="feature-page energy-history-page">
      <SectionHeader title="Energy History" subtitle={`Recorded output for ${deviceId}`} />
      <div className="analysis-toolbar">
        <Form.Group controlId="history-range" className="analysis-range-field">
          <Form.Label>Time range</Form.Label>
          <Form.Select value={range} onChange={handleRangeChange}>
          <option value="today">Today</option>
          <option value="week">7 Days</option>
          <option value="month">30 Days</option>
          <option value="custom">Custom</option>
          </Form.Select>
        </Form.Group>
        {range === 'custom' && (
            <InputGroup className="analysis-date-range">
              <FormControl
                aria-label="Start date"
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="input-group-text">to</span>
              <FormControl
                aria-label="End date"
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </InputGroup>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="feature-empty-state">
          <strong>Couldn’t load energy history</strong><p>Check the cloud API connection, then try again.</p>
        </div>
      ) : !historyData || historyData.length === 0 ? (
        <div className="feature-empty-state">
          <strong>No readings in this time range</strong><p>Choose another range or check whether the tracker has sent telemetry.</p>
        </div>
      ) : (
        <>
          <Row className="mb-3 energy-summary">
            <Col xs={6} lg={6}>
              <Card><Card.Body><span className="summary-label">Average power</span><strong className="summary-value">{formatNumber(averagePower)} <small>W</small></strong></Card.Body></Card>
            </Col>
            <Col xs={6} lg={6}>
              <Card><Card.Body><span className="summary-label">Peak power</span><strong className="summary-value">{formatNumber(peakPower)} <small>W</small></strong></Card.Body></Card>
            </Col>
          </Row>
          <div className="mb-4">
            <h5>Readings</h5>
            <div className="table-responsive">
            <Table className="table table-sm">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Power (W)</th>
                  <th>Voltage (V)</th>
                  <th>Current (A)</th>
                  <th>Pan / Tilt</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                    <tr key={item.id ?? `${item.recordedAt}-${index}`}>
                      <td>{formatDate(item.recordedAt)} {formatTimeAgo(item.recordedAt)}</td>
                      <td>{formatNumber(item.calculatedPowerW)}</td>
                      <td>{formatNumber(item.panelVoltage)}</td>
                      <td>{item.panelCurrentMa == null ? '—' : formatNumber(item.panelCurrentMa / 1000)}</td>
                      <td>{item.servoPan ?? '—'}° / {item.servoTilt ?? '—'}°</td>
                    </tr>
                ))}
              </tbody>
            </Table>
            </div>
          </div>

          <div className="mt-4">
            <h5>Energy Trend</h5>
            <PowerChart historyData={historyData} loading={false} error={null} title="Power readings over time" />
          </div>
        </>
      )}
    </div>
  );
};

export default EnergyHistory;
