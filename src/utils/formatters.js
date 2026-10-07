import { format } from 'date-fns';

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || !Number.isFinite(Number(num))) {
    return '—';
  }
  return parseFloat(num).toFixed(decimals);
};

export const formatPower = (watts) => {
  return `${formatNumber(watts)} W`;
};

export const formatVoltage = (volts) => {
  return `${formatNumber(volts)} V`;
};

export const formatCurrent = (milliamps) => {
  const amps = milliamps / 1000;
  return `${formatNumber(amps, 3)} A`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'PPp'); // e.g., Sep 27, 2026 1:30 PM
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};
