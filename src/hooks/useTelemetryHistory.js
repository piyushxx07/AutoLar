import { useState, useEffect } from 'react';
import deviceApi from '../api/deviceApi';

const useTelemetryHistory = (deviceId, start, end) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!deviceId || !start || !end) {
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await deviceApi.getTelemetryHistory(deviceId, start, end);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId, start, end]);

  return { data, loading, error };
};

export default useTelemetryHistory;
