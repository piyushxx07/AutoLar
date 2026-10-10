import { useState, useEffect } from 'react';
import deviceApi from '../api/deviceApi';

const useTelemetryHistory = (deviceId, start, end) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const startTime = start ? new Date(start).getTime() : null;
  const endTime = end ? new Date(end).getTime() : null;

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      if (!deviceId || startTime === null || endTime === null) {
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await deviceApi.getTelemetryHistory(deviceId, new Date(startTime), new Date(endTime));
        if (active) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err);
          setData([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [deviceId, startTime, endTime]);

  return { data, loading, error };
};

export default useTelemetryHistory;
