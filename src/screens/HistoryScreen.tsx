import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, ColorValue } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPLETED_TASKS_STORAGE_KEY } from './HomeScreen';
import { TaskType } from '../models/task';
import { Calendar } from 'react-native-calendars';
import { navigate } from '../../App';
import { Colors } from '../constants/colors';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { BarChart, ruleTypes } from "react-native-gifted-charts";
import { ScrollView } from 'react-native-gesture-handler';
import TileList, { TileItem } from '../components/Tile/TileList';
import { format } from 'date-fns';

interface HistoryScreenProps {
  reloadTrigger?: string
}

type barDataType= {value: number, label: string, topColor?: ColorValue, frontColor?: ColorValue, gradientColor?: ColorValue};

const loadCompletedTasks = async (): Promise<TaskType[]> => {
  try {
    const tasksString = await AsyncStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
    if (tasksString !== null) {
      const result = JSON.parse(tasksString);
      return result;
    }
  } catch (error) {
    console.error('Failed to load completed tasks from storage:', error);
  }
  return [];
};

const HistoryScreen: React.FC<HistoryScreenProps> = (props: HistoryScreenProps) => {

  const [allCompletedTasks, setAllCompletedTasks] = useState<TaskType[]>([]);
  const [summaryTiles, setSummaryTiles] = useState<TileItem[]>([]);
  const [barChartData, setBarChartData] = useState<barDataType[]>([{value: 0, label: 'Week1'}, {value: 0, label: 'Week2'}, {value: 0, label: 'Week3'},{value: 0, label: 'Week4'}]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [maxBarValue, setMaxBarValue] = useState(6);

  useEffect(() => {

    const fetchData = async () => {
      const completedTasks = await loadCompletedTasks();
      setAllCompletedTasks(completedTasks);
      console.log('Reloading data...');
    };
    
    fetchData();

  }, [props.reloadTrigger]);
  
  const currentMonthTasks = useMemo(() => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    return allCompletedTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    });
  }, [allCompletedTasks, selectedDate]);

  const completedTasksMap = useMemo(() => {
    return currentMonthTasks.reduce((acc, task) => {
      acc[task.date] = (acc[task.date] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [currentMonthTasks]);

  useEffect(() => {
    setMarkedDates(fetchCompletedTaskCalendarMarks(completedTasksMap));
    const barChartDataTmp = fetchTaskCompletionStats(completedTasksMap);
    setBarChartData(barChartDataTmp);

    setSummaryTiles(fetchSummaryTiles(completedTasksMap));
    
    const maxBarValue = Math.max(...barChartDataTmp.map(data => data.value));
    setMaxBarValue(maxBarValue < 6 ? 6 : maxBarValue + 2);
  }, [completedTasksMap]);

  const handleDayPress = (date: string) : void => {
    const tasks = getTasksForSelectedDate(date);
    const viewParams = { completionDate: date, completedTasks: tasks };
    navigate('CompletedTasks', viewParams);
  };

  const getTasksForSelectedDate = (date: string) : TaskType[] =>{ 
     const tasksForDate = allCompletedTasks.filter(task => task.date === date)

      return tasksForDate;
  };

  const getDayColor = (completedTasksCount: number) => {
    if (completedTasksCount > 10) return Colors.Primary;
    if (completedTasksCount > 7) return Colors.PrimaryMidTone;
    if (completedTasksCount > 5) return Colors.PrimaryLighterShade2;
    if (completedTasksCount >= 2 ) return Colors.PrimaryLighterShade1;
    return Colors.PrimaryLightestShade;
  };

  const fetchCompletedTaskCalendarMarks = (completedTasks: {[key:string] : number}): MarkedDates => {

    const markedDates = Object.entries(completedTasks).reduce((acc, [date, count]) => {
      acc[date] = { selected: true, selectedColor: getDayColor(count) }
      return acc;
    }, {} as MarkedDates);

    return markedDates;
  }

  const fetchTaskCompletionStats = (completedTasks: {[key:string] : number}) : barDataType[] => {

    const totalWeeks = getTotalWeeksInMonth(selectedDate);
    const weeksCompletions: { [key: number]: number } = {};

    for (let i = 1; i <= totalWeeks; i++) {
      weeksCompletions[i] = 0;
    }

    Object.entries(completedTasks).forEach(([date, count]) => {

      const week = getWeekOfMonth(new Date(date));

      if (week >= 1 && week <= 6) {

        if (weeksCompletions[week] === undefined) {
          weeksCompletions[week] = count;
        }
        else {
          weeksCompletions[week] += count;
        }
      }
    });

    let result = Object.values(weeksCompletions).map((v, index) => {
     let color = getDayColor(v); 
     return ({
        value: v, 
        label: `Week${index + 1}`,
        topColor: color,
        frontColor: color,
        gradientColor: color
      })
     });
    return result;
  }
  
  const fetchSummaryTiles = (completedTasks: {[key:string] : number}): TileItem[] => {

    const dayInMilliseconds = 86400000;
    let tasksCompleted = 0
    let mostProductiveDay = { date: 'Not found', count: 0 };
    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

    // Calculate total tasks, most productive day, and longest streak
    Object.entries(completedTasks).forEach(([date, count]) => {

      tasksCompleted += count;

      if (count > mostProductiveDay.count) {
        mostProductiveDay = { date, count };
      }

      // Check streak continuity
      const currentDate = new Date(date);

      if (previousDate && (currentDate.getTime() - previousDate.getTime()) === dayInMilliseconds) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      // Update longest streak
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      previousDate = currentDate;
    });

    return [
      { title: 'Tasks Completed', value: tasksCompleted, color: '#eff6ff' },
      { title: 'Most productive day', value: mostProductiveDay.date, color: '#f9fad7'},
      { title: 'Longest streek', value: `${longestStreak} ${longestStreak == 1 ? 'day' : 'days'}`, color: '#faeade'}
    ];
  }

  const getWeekOfMonth = (date: Date): number =>{
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekIndex = firstDayOfMonth.getDay();
    const dayOfMonth = date.getDate();
    const adjustedDate = dayOfMonth + firstDayWeekIndex;
  
    return Math.ceil(adjustedDate / 7);
  }

  const getTotalWeeksInMonth = (date: Date): number => {

    const year: number = date.getFullYear();
    const month: number = date.getMonth();
  
    const firstDayOfMonth: Date = new Date(year, month, 1);
    const lastDayOfMonth: Date = new Date(year, month + 1, 0);
    const firstDayWeekIndex: number = firstDayOfMonth.getDay();
    const daysInMonth: number = lastDayOfMonth.getDate();
    const totalWeeks = Math.ceil((firstDayWeekIndex + daysInMonth) / 7);
  
    return totalWeeks;
  }

  return (
    <ScrollView >
      <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <Calendar
            theme={{ arrowColor: Colors.Primary, todayTextColor: Colors.Primary }}
            initialDate={format(new Date(), 'yyyy-MM-dd')}
            onDayPress={(day: any) => handleDayPress(day.dateString)}
            markedDates={markedDates}
            onMonthChange={(date: DateData) => setSelectedDate(new Date(date.dateString))}
          />
        </View>
        <View style={styles.calendarWrapper}>
          <TileList items={summaryTiles} />
        </View>

        <View style={[styles.calendarWrapper, { backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }]}>
          <BarChart
            width={Dimensions.get("window").width - 100}
            height={(Dimensions.get("window").height) / 4}
            maxValue={maxBarValue}
            showGradient
            barBorderRadius={4}
            yAxisThickness={0}
            initialSpacing={10}
            spacing={17}
            endSpacing={0}
            xAxisType={ruleTypes.DASHED}
            xAxisColor={'lightgray'}
            yAxisTextStyle={{ color: '#5c5858' }}
            xAxisLabelTextStyle={{ color: '#5c5858', textAlign: 'center' }}
            labelWidth={35}
            noOfSections={5}
            data={barChartData}
            showValuesAsTopLabel
            isAnimated
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.ScreensBackground
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  calendarWrapper: {
    marginBottom: 20,
    borderRadius: 16, 
    overflow: 'hidden',
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;

