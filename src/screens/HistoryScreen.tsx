import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDateGridForMonth, getPreviousMonth, getNextMonth } from '../utils/utils';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

        let formattedDate = format(new Date(task.date), 'yyyy-MM-dd');

        if (!taskCountMap[formattedDate]) {
          taskCountMap[formattedDate] = 0;
        }
        taskCountMap[formattedDate] += 1;
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
  
  console.log(selectedDate);
  console.log(completedTasks);
  console.log(tasksForSelectedDate);

  const months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
      <View style={styles.weekDaysContainer}>
        {months.map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {dateGrid.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.day, { backgroundColor: day.date ? getColor(day.count) : 'transparent' }]} 
            onPress={() => day.date && handleDayPress(day.date)}
          >
            <Text style={styles.dayText}>{day.date ? format(new Date(day.date), 'd') : ''}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tasks for {selectedDate}</Text>
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map((task, index) => (
                <Text key={index} style={styles.taskText}>{task.title}</Text>
              ))
            ) : (
              <Text style={styles.taskText}>No tasks completed on this day.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Ensure rows contain 7 items
  },
  day: {
    width: 30,
    height: 30,
    margin: 7, // Adjust margin to fit 7 items per row
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HistoryScreen;