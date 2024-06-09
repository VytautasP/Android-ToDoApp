import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Task from '../components/Task';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

interface TaskType {
  title: string;
  completed: boolean;
  date: string;
}

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
      const newTask = { title: task, completed: false, date: date.toDateString() };
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

  const groupedTasks = tasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
    (acc[task.date] = acc[task.date] || []).push(task);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedTasks).map((date) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            {groupedTasks[date].map((task, index) => (
              <Task
                key={index}
                task={task}
                index={index}
                completeTask={completeTask}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={task}
          onChangeText={setTask}
        />
      </View>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HomeScreen;