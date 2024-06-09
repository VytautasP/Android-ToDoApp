import { eachDayOfInterval, endOfMonth, startOfMonth, format, subMonths, addMonths } from 'date-fns';

export const generateDateGridForMonth = (month: Date) => {
  const startDate = startOfMonth(month);
  const endDate = endOfMonth(month);
  return eachDayOfInterval({ start: startDate, end: endDate }).map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    count: 0,
  }));
};

export const getPreviousMonth = (month: Date) => subMonths(month, 1);
export const getNextMonth = (month: Date) => addMonths(month, 1);