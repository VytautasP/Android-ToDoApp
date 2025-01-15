import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPLETED_TASKS_STORAGE_KEY } from './HomeScreen';
import { TaskType } from '../models/task';
import { Calendar } from 'react-native-calendars';
import { navigate } from '../../App';
import { Colors } from '../constants/colors';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { BarChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import TileList, { TileItem } from '../components/Tile/TileList';
import { format } from 'date-fns';

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

const HistoryScreen: React.FC = () => {
  const [allCompletedTasks, setAllCompletedTasks] = useState<TaskType[]>([]);
  const [summaryTiles, setSummaryTiles] = useState<TileItem[]>([]);
  const [barChartData, setBarChartData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {

    console.log('History screen mounted, with date: ', selectedDate);

    const fetchData = async () => {
      const completedTasks = await loadCompletedTasks();
      setAllCompletedTasks(completedTasks);
    };
      
    fetchData();

  }, []);
  
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
    setBarChartData(fetchTaskCompletionStats(completedTasksMap));
    setSummaryTiles(fetchSummaryTiles(completedTasksMap));
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

  const fetchTaskCompletionStats = (completedTasks: {[key:string] : number}) : number[] => {

    // calculate weeks from 1 to 5 and add the number of completions for each week
    //add zero completions for weeks that have no completions

    const weeksCompletions: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    };

    // Process each date and add its completions to the corresponding week
    Object.entries(completedTasks).forEach(([date, count]) => {

      // Extract the day from the date and calculate the week (1 to 5)

      const day = parseInt(date.split('-')[2], 10);
      const week = Math.ceil(day / 7);

      if (week >= 1 && week <= 6) {
        weeksCompletions[week] += count;
      }
    });

    return Object.values(weeksCompletions);
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
        <View style={styles.calendarWrapper}>
          <BarChart
            data={{
              labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
              datasets: [{ data: barChartData }]
            }}
            width={Dimensions.get("window").width - 40}
            fromZero={true}
            height={(Dimensions.get("window").height ) / 4}
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars={true}
            chartConfig={{
              backgroundColor: "white",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
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

