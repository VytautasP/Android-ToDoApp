import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../style/style'
import { COMPLETED_TASKS_STORAGE_KEY } from './HomeScreen';
import { TaskType } from '../models/task';
import { Calendar } from 'react-native-calendars';
import { navigate } from '../../App';
import { Colors } from '../constants/colors';
import { MarkedDates } from 'react-native-calendars/src/types';
import { BarChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import TileList from '../components/Tile/TileList';

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
  const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
 
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const loadedCompletedTasks = await loadCompletedTasks();
      setCompletedTasks(loadedCompletedTasks);
    };

    fetchCompletedTasks();
    
  }, []);

  const handleDayPress = (date: string) : void => {
    const tasks = getTasksForSelectedDate(date);
    const viewParams = { completionDate: date, completedTasks: tasks };
    navigate('CompletedTasks', viewParams);
  };

  const getTasksForSelectedDate = (date: string) : TaskType[] =>{ 
     const tasksForDate = completedTasks.filter(task => task.date === date)

      return tasksForDate;
  };

  const getDayColor = (completedTasksCount: number) => {
    if (completedTasksCount > 10) return Colors.Primary;
    if (completedTasksCount > 7) return Colors.PrimaryMidTone;
    if (completedTasksCount > 5) return Colors.PrimaryLighterShade2;
    if (completedTasksCount >= 2 ) return Colors.PrimaryLighterShade1;
    return Colors.PrimaryLightestShade;
  };

  const getMarkedDates = (): MarkedDates => {

    const daysCompletions: { [key: string]: number } = {};

    completedTasks.forEach(task => {
      if (daysCompletions[task.date]) {
        daysCompletions[task.date] += 1;
      } else {
        daysCompletions[task.date] = 1;
      }
    });

    const markedDates = Object.entries(daysCompletions).reduce((acc, [date, count]) => {
      acc[date] = { selected: true, selectedColor: getDayColor(count) }
      return acc;
    }, {} as MarkedDates);

    return markedDates;
  }

  return (
    <ScrollView >
      <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <Calendar
            theme={{ arrowColor: Colors.Primary, todayTextColor: Colors.Primary }}
            onDayPress={(day: any) => handleDayPress(day.dateString)}
            markedDates={getMarkedDates()}
          />
        </View>
        <View style={styles.calendarWrapper}>
          <TileList items={[
            { title: 'Tasks Completed', value: completedTasks.length, color: '#eff6ff' },
            { title: 'Completion rate', value: '75%', color: '#f0fdf4' },
            { title: 'Most active day', value: '2024-12-05', color: '#faf5ff'},
            { title: 'Most productive day', value: '2024-12-05', color: '#f9fad7'},
            { title: 'Longest streek', value: '3 days', color: '#faeade'},
          ]} 
          />
        </View>
        <View style={styles.calendarWrapper}>
          <BarChart
            data={{
              labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
              datasets: [{ data: [4, 7, 20, 35, 3] }]
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