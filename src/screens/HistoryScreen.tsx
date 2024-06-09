import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDateGrid } from '../utils/utils';
import { format } from 'date-fns';


interface TaskType {
  title: string;
  completed: boolean;
  date: string;
}

const COMPLETED_TASKS_STORAGE_KEY = '@completedTasks';

const loadCompletedTasks = async (): Promise<TaskType[]> => {
  try {
    const tasksString = await AsyncStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
    if (tasksString !== null) {
      return JSON.parse(tasksString);
    }
  } catch (error) {
    console.error('Failed to load completed tasks from storage:', error);
  }
  return [];
};

const HistoryScreen: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
  const [dateGrid, setDateGrid] = useState(generateDateGrid());

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const loadedCompletedTasks = await loadCompletedTasks();
      setCompletedTasks(loadedCompletedTasks);

      // Map tasks to the date grid
      const taskCountMap: { [key: string]: number } = {};
      loadedCompletedTasks.forEach(task => {
         
        var formattedDate = format(new Date(task.date), 'yyyy-MM-dd');
        //console.log(formattedDate);
        
        if (!taskCountMap[formattedDate]) {
          taskCountMap[formattedDate] = 0;
        }
        taskCountMap[formattedDate] += 1;
      });

      //console.log(taskCountMap);

      const updatedDateGrid = generateDateGrid().map(day => ({
        ...day,
        count: taskCountMap[day.date] || 0,
      }));

      setDateGrid(updatedDateGrid);
      //console.log(updatedDateGrid);
    };

    fetchCompletedTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks History</Text>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {dateGrid.map((day, index) => (
          <View key={index} style={[styles.day, { backgroundColor: getColor(day.count) }]} />
        ))}
      </ScrollView>
    </View>
  );
};

const getColor = (count: number) => {
  if (count > 4) return '#216e39'; // Darkest color
  if (count > 3) return '#30a14e';
  if (count > 2) return '#40c463';
  if (count > 1) return '#9be9a8';
  return '#ebedf0'; // Lightest color
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
    marginBottom: 20,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: 15,
    height: 15,
    margin: 2,
  },
});

export default HistoryScreen;