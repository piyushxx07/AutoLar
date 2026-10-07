import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Spinner } from 'react-bootstrap';

const CurrentChart = ({ historyData, loading, error, title = 'Panel current' }) => {
  if (loading) {
    return (
      <Card className="chart-card h-100">
        <Card.Body className="chart-body">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="chart-card h-100">
        <Card.Body className="chart-body">
          <p className="text-danger">Error loading data</p>
        </Card.Body>
      </Card>
    );
  }

  if (!historyData || historyData.length === 0) {
    return (
      <Card className="chart-card h-100">
        <Card.Body>
          <p className="text-center">No data available</p>
        </Card.Body>
      </Card>
    );
  }

  // Prepare data for recharts: convert timestamp to date object
  const chartData = historyData.map((item) => ({
    name: new Date(item.recordedAt),
    current: item.panelCurrentMa, // in milliamps
  }));

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="card-title">{title}</h5>
      </Card.Header>
      <Card.Body className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 5" vertical={false} />
            <XAxis dataKey="name" minTickGap={28} tickLine={false} axisLine={false} tickFormatter={(date) => {
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }} />
            <YAxis tickLine={false} axisLine={false} width={42} />
            <Tooltip />
            <Legend verticalAlign="top" height={30} />
            <Line type="monotone" dataKey="current" name="Current (mA)" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default CurrentChart;
