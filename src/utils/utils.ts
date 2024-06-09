import { eachDayOfInterval, endOfYear, startOfYear, format } from 'date-fns';

export const generateDateGrid = () => {
  const now = new Date();
  const startDate = startOfYear(now);
  const endDate = endOfYear(now);
  return eachDayOfInterval({ start: startDate, end: endDate }).map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    count: 0,
  }));
};