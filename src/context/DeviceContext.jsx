import React, { createContext, useContext, useState } from 'react';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceId, setDeviceIdState] = useState(() => localStorage.getItem('autolar-device-id') || 'esp32_tracker_01');
  const setDeviceId = (nextDeviceId) => {
    const normalized = String(nextDeviceId || '').trim();
    setDeviceIdState(normalized);
    if (normalized) localStorage.setItem('autolar-device-id', normalized);
    else localStorage.removeItem('autolar-device-id');
  };

  return (
    <DeviceContext.Provider value={{ deviceId, setDeviceId }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
