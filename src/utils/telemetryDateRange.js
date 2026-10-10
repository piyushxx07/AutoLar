export function getTelemetryDateRange(range, { selectedMonth = '', startDate = '', endDate = '' } = {}) {
  const end = new Date();
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
    case 'days30':
      start = new Date();
      start.setDate(start.getDate() - 30);
      break;
    case 'lastMonth':
      start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);
      return { start, end: new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999) };
    case 'month': {
      if (!selectedMonth) return { start: null, end: null };
      const [year, month] = selectedMonth.split('-').map(Number);
      if (!year || !month) return { start: null, end: null };
      start = new Date(year, month - 1, 1);
      return { start, end: new Date(year, month, 0, 23, 59, 59, 999) };
    }
    case 'custom': {
      if (!startDate || !endDate) return { start: null, end: null };
      start = new Date(`${startDate}T00:00:00`);
      const customEnd = new Date(`${endDate}T23:59:59.999`);
      if (!Number.isFinite(start.getTime()) || !Number.isFinite(customEnd.getTime()) || start > customEnd) {
        return { start: null, end: null };
      }
      return { start, end: customEnd };
    }
    default:
      start = new Date();
      start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}
