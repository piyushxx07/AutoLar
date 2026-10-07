import React, { useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import useTelemetryHistory from '../hooks/useTelemetryHistory';
import { formatNumber } from '../utils/formatters';
import { Col, Row, Card, InputGroup, FormControl, Form } from 'react-bootstrap';
import PowerChart from '../components/charts/PowerChart';
import VoltageChart from '../components/charts/VoltageChart';
import CurrentChart from '../components/charts/CurrentChart';
import SectionHeader from '../components/common/SectionHeader';

const Analytics = () => {
  const { deviceId } = useDevice();
  const [range, setRange] = useState('today'); // today, week, month, custom
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Calculate start and end dates based on range
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

  const { start, end } = calculateDateRange();
  const { data: historyData, loading, error } = useTelemetryHistory(deviceId, start, end);

  // Calculate summary statistics
  const calculateSummary = (data) => {
    if (!data || data.length === 0) {
      return {
        avgPower: null,
        peakPower: null,
        avgVoltage: null,
        avgCurrent: null,
      };
    }

    const powers = data.map((d) => d.calculatedPowerW).filter(Number.isFinite);
    const voltages = data.map((d) => d.panelVoltage).filter(Number.isFinite);
    const currents = data.map((d) => d.panelCurrentMa).filter(Number.isFinite);

    const avgPower = powers.length ? powers.reduce((a, b) => a + b, 0) / powers.length : null;
    const peakPower = powers.length ? Math.max(...powers) : null;
    const avgVoltage = voltages.length ? voltages.reduce((a, b) => a + b, 0) / voltages.length : null;
    const avgCurrent = currents.length ? (currents.reduce((a, b) => a + b, 0) / currents.length) / 1000 : null;

    return {
      avgPower,
      peakPower,
      avgVoltage,
      avgCurrent,
    };
  };

  const summary = calculateSummary(historyData);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (e.target.value === 'custom') {
      // Reset custom dates
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="feature-page analytics-page">
      <SectionHeader title="Analytics" subtitle={`Performance trends for ${deviceId}`} />
      <div className="analysis-toolbar">
        <Form.Group controlId="analytics-range" className="analysis-range-field">
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
          <strong>Couldn’t load analytics</strong><p>Check the cloud API connection, then try again.</p>
        </div>
      ) : !historyData || historyData.length === 0 ? (
        <div className="feature-empty-state">
          <strong>No readings in this time range</strong><p>Choose another range or check whether the tracker has sent telemetry.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col xs={6} sm={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Power</Card.Title>
                  <Card.Text className="display-5">{formatNumber(summary.avgPower)} W</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Peak Power</Card.Title>
                  <Card.Text className="display-5">{formatNumber(summary.peakPower)} W</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Voltage</Card.Title>
                  <Card.Text className="display-5">{formatNumber(summary.avgVoltage)} V</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Current</Card.Title>
                  <Card.Text className="display-5">{summary.avgCurrent == null ? '—' : `${formatNumber(summary.avgCurrent * 1000)} mA`}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="mb-4">
            <Col xl={4}>
              <PowerChart historyData={historyData} loading={false} error={null} title={`Power · ${range}`} />
            </Col>
            <Col xl={4}>
              <VoltageChart historyData={historyData} loading={false} error={null} title={`Voltage · ${range}`} />
            </Col>
            <Col xl={4}>
              <CurrentChart historyData={historyData} loading={false} error={null} title={`Current · ${range}`} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Analytics;
