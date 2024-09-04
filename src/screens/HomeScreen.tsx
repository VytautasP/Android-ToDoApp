import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { format } from 'date-fns';
import { TaskType } from '../models/task';
import TaskList from '../components/TaskList/TaskList';
import TouchableButton from '../components/button/TouchableButton';
import AddTaskModal from '../components/AddTaskModal/AddTaskModal';
import "react-native-get-random-values";
import { v4 as uuid } from 'uuid';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';


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
    Alert.alert('Error', 'Failed to load tasks from storage');
  }
  return [];
};

const saveTasks = async (key: string, tasks: TaskType[]) => {
  try {
    const tasksString = JSON.stringify(tasks);
    await AsyncStorage.setItem(key, tasksString);
  } catch (error) {
    console.error(`Failed to save tasks to storage (${key}):`, error);
    Alert.alert('Error', 'Failed to save tasks to storage');
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

  const onAddTask = (task: string, date: Date) => {

    setModalVisible(false);

    if (task.length > 0) 
    {
      const newTask = { 
        id: uuid(),
        title: task, 
        completed: false, 
        date: format(date, "yyyy-MM-dd") 
      };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveTasks(TASKS_STORAGE_KEY, newTasks);
    } 
    else 
    {
      Alert.alert('Error', 'Task cannot be empty');
    }

  }

  const completeTask = (id: string) => {
    const index = tasks.findIndex((task) => task.id === id);
    const newTasks = [...tasks];
    const completedTask = { ...newTasks[index], completed: true };
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasks(TASKS_STORAGE_KEY, newTasks);

    const newCompletedTasks = [...completedTasks, completedTask];
    setCompletedTasks(newCompletedTasks);
    saveTasks(COMPLETED_TASKS_STORAGE_KEY, newCompletedTasks);
  };

  const deleteTask = (id: string) => {
    const index = tasks.findIndex((task) => task.id === id);
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasks(TASKS_STORAGE_KEY, newTasks);
  };

  const scheduleTaskReminder = async (id: string, date: Date) => {

    console.log(`Scheduling reminder for task with ID: ${id} at ${date}`);
    
    await notifee.requestPermission();

    const task = tasks.find((task) => task.id === id)!;

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Create a trigger notification
    const reminderId = await notifee.createTriggerNotification(
      {
        title: 'ToDo Task Reminder',
        body: task.title,
        android: {
          channelId: channelId,
          smallIcon: 'ic_check_list', // optional, defaults to 'ic_launcher'.
          color: '#808000',
        },
      },
      trigger
    );

    console.log(`Scheduled reminder with ID: ${reminderId}`);
  }

  return (
    <View style={styles.container}>
      <TaskList tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} scheduleTask={scheduleTaskReminder} />
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