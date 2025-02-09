import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, set } from 'date-fns';
import { TaskType } from '../models/task';
import Ionicon from 'react-native-vector-icons/Ionicons';
import CreateUpdateTaskModal from '../components/CreateUpdateTaskModal/CreateUpdateTaskModal';
import "react-native-get-random-values";
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../constants/colors';
import MonthTaskList from '../components/TaskList/MonthTaskList';

export const TASKS_STORAGE_KEY = '@todo-tasks-storage';
export const COMPLETED_TASKS_STORAGE_KEY = '@todo-completed-tasks-storage';

export const loadTasks = async (key: string): Promise<TaskType[]> => {
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

export const saveTasks = async (key: string, tasks: TaskType[]) => {
  try {
    const tasksString = JSON.stringify(tasks);
    await AsyncStorage.setItem(key, tasksString);
  } catch (error) {
    console.error(`Failed to save tasks to storage (${key}):`, error);
    Alert.alert('Error', 'Failed to save tasks to storage');
  }
};


interface HomeScreenProps {
  deliveredNotifications: string[];
  onTaskCompleted: (task: TaskType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ deliveredNotifications, onTaskCompleted }: HomeScreenProps) => {

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
  const [createUpdateTaskModalVisible, setCreateUpdateTaskModalVisible] = useState(false);

  useEffect(() => {

    const fetchTasks = async () => {

      const loadedTasks = await loadTasks(TASKS_STORAGE_KEY);

      setLoadedActiveTasks(loadedTasks);
      const loadedCompletedTasks = await loadTasks(COMPLETED_TASKS_STORAGE_KEY);
      setLoadedCompletedTasks(loadedCompletedTasks);
    };

    fetchTasks();
  }, [deliveredNotifications]);


  const setLoadedActiveTasks = (tasks: TaskType[]) => {
     setTasks(tasks);
  }

  const setLoadedCompletedTasks = (tasks: TaskType[]) => {
    setCompletedTasks(tasks);
 }

  const onAddTask = (task: TaskType) : void => {

    setCreateUpdateTaskModalVisible(false);

    if (task.title.length > 0) {
      const newTasks = [...tasks, task];
      setLoadedActiveTasks(newTasks);
      saveTasks(TASKS_STORAGE_KEY, newTasks);
    }
    else {
      Alert.alert('Error', 'Task cannot be empty');
    }

  }

  const onEditTask = async (task: TaskType) : Promise<void>  => {

    if (task.title.length < 1) {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }

    const index = tasks.findIndex((t) => t.id === task.id);
    const originalTask = tasks[index];

    originalTask.title = task.title;
    originalTask.date = task.date;

    const taskDateChanged = originalTask.date !== task.date;

    if (taskDateChanged) {

      await cancelTaskNotification(originalTask);

      const originalDate = new Date(originalTask.date);
      const newTaskReminderDate = new Date(task.date);
      set(newTaskReminderDate, { hours: originalDate.getHours(), minutes: originalDate.getMinutes() });

      const reminderId = await AddTaskToScheduler(originalTask, newTaskReminderDate);

      originalTask.reminderId = reminderId;
      originalTask.reminderDate = format(newTaskReminderDate, "yyyy-MM-dd HH:mm:ss");

    }

    saveTasks(TASKS_STORAGE_KEY, tasks);
    setLoadedActiveTasks([...tasks]);
  }

  const completeTask = async (id: string) : Promise<void>  => {

    const index = tasks.findIndex((task) => task.id === id);
    const task = tasks[index];
    await cancelTaskNotification(task);

    const newTasks = [...tasks];
    const completedTask = { ...newTasks[index], completed: true };
    newTasks.splice(index, 1);
    saveTasks(TASKS_STORAGE_KEY, newTasks);
    setLoadedActiveTasks(newTasks);

    const newCompletedTasks = [...completedTasks, completedTask];
    saveTasks(COMPLETED_TASKS_STORAGE_KEY, newCompletedTasks);
    setLoadedCompletedTasks(newCompletedTasks);
    onTaskCompleted(completedTask)
  };

  const deleteTask = async (id: string) : Promise<void> => {
    const index = tasks.findIndex((task) => task.id === id);
    const task = tasks[index];

    await cancelTaskNotification(task);

    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    saveTasks(TASKS_STORAGE_KEY, newTasks);
    setLoadedActiveTasks(newTasks);

  };

  const scheduleTaskReminder = async (id: string, date: Date) : Promise<void>  => {

    const task = tasks.find((task) => task.id === id)!;

    const reminderId = await AddTaskToScheduler(task, date);

    task.reminderId = reminderId;
    task.reminderDate = format(date, "yyyy-MM-dd HH:mm:ss");
    saveTasks(TASKS_STORAGE_KEY, tasks);
    setLoadedActiveTasks([...tasks]);
  }

  const AddTaskToScheduler = async (task: TaskType, date: Date): Promise<string> => {

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'Default',
      name: 'Default-Channel',
      importance: AndroidImportance.HIGH,
    });

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      // alarmManager: {
      //   allowWhileIdle: true
      // }
    };

    // Create a trigger notification
    const reminderId = await notifee.createTriggerNotification(
      {
        title: 'ToDo Task Reminder',
        body: task.title,
        data: {
          taskId: task.id
        },
        android: {
          channelId: channelId,
          smallIcon: 'ic_check_list', // optional, defaults to 'ic_launcher'.
          color: '#808000',
        },
      },
      trigger
    );

    if (__DEV__) {
      console.log('Task scheduled with reminderId: ', reminderId);
      console.log('Task scheduled with date: ', date);
    }

    return reminderId;

  }

  const cancelScheduleTaskReminder = async (id: string) : Promise<void> => {
    const task = tasks.find((task) => task.id === id)!;

    await cancelTaskNotification(task);

    saveTasks(TASKS_STORAGE_KEY, tasks);
    setLoadedActiveTasks([...tasks]);
  }

  const cancelTaskNotification = async (task: TaskType) : Promise<void> => {

    if (task.reminderId) {
      await notifee.cancelNotification(task.reminderId);

      task.reminderId = undefined;
      task.reminderDate = undefined;
    }
  }

  return (
    <View style={styles.container}>

      <MonthTaskList
        tasks={tasks}
        completeTask={completeTask}
        editTask={onEditTask}
        deleteTask={deleteTask}
        scheduleTask={scheduleTaskReminder}
        cancelScheduleTask={cancelScheduleTaskReminder}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => setCreateUpdateTaskModalVisible(true)}>
        <Ionicon style={{ width: 60, height: 60 }} size={60} name="add-circle" color={Colors.Primary} />
      </TouchableOpacity>

      {/* Modal for adding task */}
      <CreateUpdateTaskModal
        isModalVisible={createUpdateTaskModalVisible}
        onConfirm={onAddTask}
        onClose={() => setCreateUpdateTaskModalVisible(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.ScreensBackground,
  },
  taskViewOptions: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10
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
  floatingButton: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10
  }
});

export default HomeScreen;