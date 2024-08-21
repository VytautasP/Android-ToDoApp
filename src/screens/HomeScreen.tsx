import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { format, set } from 'date-fns';
import { TaskType } from '../models/task';
import TaskList from '../components/TaskList/TaskList';
import TouchableButton from '../components/button/TouchableButton';
import AddTaskModal from '../components/AddTaskModal/AddTaskModal';


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

  const onAddTask = (task: string, date: Date) => {
    setModalVisible(false);

    if (task.length > 0) {
      const newTask = { title: task, completed: false, date: format(date, "yyyy-MM-dd") };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveTasks(TASKS_STORAGE_KEY, newTasks);
    } else {
      Alert.alert('Task cannot be empty');
    }
  }

  const onCancelTask = () => {
    setModalVisible(false);
    console.log(modalVisible)
  }

  return (
    <View style={styles.container}>
      <TaskList tasks={tasks} completeTask={completeTask} />
      <View>
        <TouchableButton text="Add" onClick={() => setModalVisible(true)} />
        <TouchableButton text="View History" onClick={() => navigation.navigate('History')} />
      </View>

      {/* Modal for adding task */}
      <AddTaskModal
        isModalVisible={modalVisible}
        onConfirm={onAddTask}
        onClose={() => setModalVisible(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  }
});

export default HomeScreen;