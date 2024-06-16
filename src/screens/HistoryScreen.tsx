import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDateGridForMonth, getPreviousMonth, getNextMonth } from '../utils/utils';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TaskHistoryGrid from '../components/TaskHistory/TaskHistoryGrid';
import TaskHistoryDetails from '../components/TaskHistory/TaskHistoryDetails';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateGrid, setDateGrid] = useState(generateDateGridForMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const loadedCompletedTasks = await loadCompletedTasks();
      setCompletedTasks(loadedCompletedTasks);

      // Map tasks to the date grid
      const taskCountMap: { [key: string]: number } = {};
      loadedCompletedTasks.forEach(task => {
        if (!taskCountMap[task.date]) {
          taskCountMap[task.date] = 0;
        }
        taskCountMap[task.date] += 1;
      });

      const updatedDateGrid = generateDateGridForMonth(currentMonth).map(day => ({
        ...day,
        count: taskCountMap[day.date] || 0,
      }));

      setDateGrid(updatedDateGrid);
    };

    fetchCompletedTasks();
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const tasksForSelectedDate = completedTasks.filter(task => task.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks History</Text>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Icon name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Icon name="arrow-forward" size={30} color="#6200ee" />
        </TouchableOpacity>
      </View>
      <TaskHistoryGrid completedTasks={dateGrid} handleDayPress={handleDayPress} />
      <TaskHistoryDetails
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedDate={selectedDate}
        tasksForSelectedDate={tasksForSelectedDate}
      />
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