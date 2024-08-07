import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { format } from 'date-fns';
import { TaskType } from '../models/task';
import TaskList from '../components/TaskList/TaskList';
import TouchableButton from '../components/button/TouchableButton';


const TASKS_STORAGE_KEY = '@tasks';
const COMPLETED_TASKS_STORAGE_KEY = '@completedTasks';

const loadTasks = async (key: string): Promise<TaskType[]> => {
  try {
    const tasksString = await AsyncStorage.getItem(key);
    if (tasksString !== null) {
      return JSON.parse(tasksString);
    }
  } catch (error) {
    console.error(`Failed to load tasks from storage (${key}):`, error);
  }
  return [];
};

const saveTasks = async (key: string, tasks: TaskType[]) => {
  try {
    const tasksString = JSON.stringify(tasks);
    await AsyncStorage.setItem(key, tasksString);
  } catch (error) {
    console.error(`Failed to save tasks to storage (${key}):`, error);
  }
};

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await loadTasks(TASKS_STORAGE_KEY);
      setTasks(loadedTasks);
      const loadedCompletedTasks = await loadTasks(COMPLETED_TASKS_STORAGE_KEY);
      setCompletedTasks(loadedCompletedTasks);
    };

    fetchTasks();
  }, []);

  const addTask = () => {
    if (task.length > 0) {
      const newTask = { title: task, completed: false, date: format(date, "yyyy-MM-dd") };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveTasks(TASKS_STORAGE_KEY, newTasks);
      setTask('');
    } else {
      Alert.alert('Task cannot be empty');
    }
  };

  const completeTask = (index: number) => {
    const newTasks = [...tasks];
    const completedTask = { ...newTasks[index], completed: true };
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasks(TASKS_STORAGE_KEY, newTasks);

    const newCompletedTasks = [...completedTasks, completedTask];
    setCompletedTasks(newCompletedTasks);
    saveTasks(COMPLETED_TASKS_STORAGE_KEY, newCompletedTasks);
  };

  return (
    <View style={styles.container}>
      <TaskList tasks={tasks} completeTask={completeTask} />
      <View>
        <TouchableButton text="Add" onClick={() => setModalVisible(true)} />
        <TouchableButton text="View History" onClick={() => navigation.navigate('History')} />
      </View>

      {/* Modal for adding task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput style={styles.input} placeholder="Task Description" value={task} onChangeText={setTask} />

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Select Date: {format(date, 'yyyy-MM-dd')}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>

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
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 60, 
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 20, 
  },
  dateTimeContainer: {
    marginBottom: 10, 
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  dateButtonText: {
    fontSize: 18,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken background
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;