import { eachDayOfInterval, endOfMonth, startOfMonth, format, subMonths, addMonths, startOfWeek, getDay } from 'date-fns';

export const generateDateGridForMonth = (month: Date) => {

    const monthDt = month;
    monthDt.setUTCDate(1);
    monthDt.setUTCHours(0, 0, 0, 0);
    const startDate = monthDt;
    const endDate = endOfMonth(monthDt);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
    // Determine the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(monthDt);
    const endDay = getDay(endDate);
    console.log(monthDt);
    console.log(startDate);
    console.log(startDay);
    console.log(endDate);
    console.log(endDay);

    const prefixPaddingDays = [];
    const suffixPaddingDays = [];
    
    // Calculate padding to start the month on the correct weekday column (Monday)
    const prefixPaddingCount = (startDay === 0 ? 6 : startDay - 1); // Shift Sunday (0) to the end
  
    // Calculate padding to start the month on the correct weekday column (Monday)
    const suffixPaddingCount = (endDay === 0 ? 6 : 7 - endDay); // Shift Sunday (0) to the end

    for (let i = 0; i < prefixPaddingCount; i++) {
      prefixPaddingDays.push({ date: '', count: 0 });
    }

    for (let i = 0; i < suffixPaddingCount; i++) {
      suffixPaddingDays.push({ date: '', count: 0 });
    }
  
    const result = prefixPaddingDays.concat(
      daysInMonth.map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        count: 0,
      }))
    ).concat(suffixPaddingDays);

    return result;
  };

export const getPreviousMonth = (month: Date) => subMonths(month, 1);
export const getNextMonth = (month: Date) => addMonths(month, 1);

function utcToZonedTime(now: Date, tz: string) {
    throw new Error('Function not implemented.');
}
