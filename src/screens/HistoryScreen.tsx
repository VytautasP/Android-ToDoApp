import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const loadedCompletedTasks = await loadCompletedTasks();
      setCompletedTasks(loadedCompletedTasks);
    };

    fetchCompletedTasks();
  }, []);

  const groupedTasks = completedTasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
    (acc[task.date] = acc[task.date] || []).push(task);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks History</Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedTasks).map((date) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            {groupedTasks[date].map((task, index) => (
              <View key={index} style={styles.taskContainer}>
                <Text style={styles.taskText}>{task.title}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 20,
    color: '#333',
    fontFamily: 'YourNewFont',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  taskContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Roboto',
  },
});

export default HistoryScreen;