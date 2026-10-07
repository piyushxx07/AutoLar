import { useState, useEffect } from 'react';
import deviceApi from '../api/deviceApi';

const useRecommendation = (deviceId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `autolar-last-recommendation:${deviceId}`;
    let active = true;
    let cachedRecommendation = null;
    try { cachedRecommendation = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { /* Ignore invalid browser cache. */ }
    setData(cachedRecommendation);
    setLoading(!cachedRecommendation);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await deviceApi.getRecommendation(deviceId);
        if (!active) return;
        setData(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => { active = false; clearInterval(interval); };
  }, [deviceId]);

  return { data, loading, error };
};

export default useRecommendation;
