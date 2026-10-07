import { useState, useEffect } from 'react';
import deviceApi from '../api/deviceApi';

const useLatestTelemetry = (deviceId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const cacheKey = `autolar-last-telemetry:${deviceId}`;
    let active = true;
    let cachedData = null;
    try { cachedData = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { /* Ignore invalid browser cache. */ }
    setData(cachedData);
    setLoading(!cachedData);
    setError(null);
    setConnected(false);

    const fetchData = async () => {
      try {
        const response = await deviceApi.getLatestTelemetry(deviceId);
        if (!active) return;
        setData(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        setError(null);
        setConnected(true);
      } catch (err) {
        if (!active) return;
        setError(err);
        setConnected(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Keep live telemetry fresh every five seconds.
    return () => { active = false; clearInterval(interval); };
  }, [deviceId]);

  const recordedAt = data?.recordedAt ? Date.parse(data.recordedAt) : NaN;
  const readingAgeMs = Number.isFinite(recordedAt) ? Date.now() - recordedAt : Infinity;
  const isOnline = connected && !loading && readingAgeMs >= -60_000 && readingAgeMs <= 30 * 60_000;

  return { data, loading, error, isOnline };
};

export default useLatestTelemetry;
