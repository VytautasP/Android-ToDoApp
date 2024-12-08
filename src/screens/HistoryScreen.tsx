import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../style/style'
import { COMPLETED_TASKS_STORAGE_KEY } from './HomeScreen';
import { TaskType } from '../models/task';
import { Calendar } from 'react-native-calendars';
import { navigate } from '../../App';

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const loadedCompletedTasks = await loadCompletedTasks();
      setCompletedTasks(loadedCompletedTasks);
    };

    fetchCompletedTasks();
    
  }, []);

  const handleDayPress = (date: string) : void => {
    setSelectedDate(date);
    const tasks = getTasksForSelectedDate();
    navigate('CompletedTasks', { completionDate: date, completedTasks: tasks});
  };

  const getTasksForSelectedDate = () : TaskType[] =>{ 
     const tasksForDate = completedTasks.filter(task => task.date === selectedDate)

      return tasksForDate;
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={{
          height: 320
        }}
        onDayPress={(day: any) => handleDayPress(day.dateString)}

        //IMPORTANT: This is just for testing purposes. Remove this code when done testing.
        markedDates={{
          '2024-12-05': { selected: true, selectedColor: '#40c463' },
          '2024-12-15': { selected: true, selectedColor: '#30a14e' }
        }}

      />

      <Text style={[styles.title, globalStyles.textColor]}>Completed Tasks History Summary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;