// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const TASKS_STORAGE_KEY = '@tasks';

interface TaskType {
  title: string;
  completed: boolean;
  date: string;
}

const loadTasks = async (): Promise<TaskType[]> => {
    try {
      const tasksString = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (tasksString !== null) {
        return JSON.parse(tasksString);
      }
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
    }
    return [];
  };
  
  const saveTasks = async (tasks: TaskType[]) => {
    try {
      const tasksString = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, tasksString);
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
    }
  };

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addTask = () => {
    if (task.length > 0) {
      const newTasks = [...tasks, { title: task, completed: false, date: date.toDateString() }];
      setTasks(newTasks);
      saveTasks(newTasks);
      setTask('');
    } else {
      Alert.alert('Task cannot be empty');
    }
  };

  const completeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasks(newTasks);
  };


  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    };
  
    fetchTasks();
  }, []);

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
                deleteTask={deleteTask}
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
  dateTimeContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 18,
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
    marginBottom: 20, 
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;