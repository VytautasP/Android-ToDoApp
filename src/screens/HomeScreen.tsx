import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Switch } from 'react-native';
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
        <TouchableWithoutFeedback onPress={() => { setModalVisible(false) }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Task Description</Text>

              {/* Line */}
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  width: '98%',
                }} />

              <View style={styles.section}>
                <View style={styles.dateTimeContainer}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Select Date"
                    value={format(date, 'yyyy-MM-dd')}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <TextInput
                  multiline={true}
                  style={styles.input}
                  placeholder="Enter your task here..."
                  value={task}
                  onChangeText={setTask}
                />
              </View>



              <View style={styles.buttonContainer}>
                <TouchableButton
                  buttonStyle={styles.modalButton}
                  buttonTextStyle={styles.modalButtonText}
                  text='OK'
                  onClick={addTask} />

                <TouchableButton
                  buttonStyle={styles.modalButton}
                  buttonTextStyle={styles.modalButtonText}
                  text='Cancel'
                  onClick={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken background
  },
  modalView: {
    width: '90%', // Responsive width
    maxWidth: 400, // Maximum width
    backgroundColor: '#fff', // White background
    borderRadius: 12, // Rounded corners
    paddingVertical: 30, // Padding
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Text color
    textAlign: 'center',
  },
  section: {
    width: '100%',
    //padding: 20,
    marginBottom: 15, // Space between sections
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners for input fields
    paddingHorizontal: 15,
    backgroundColor: '#fff', // White background for inputs
    fontSize: 16, // Consistent font size
    textAlignVertical: 'top', // Aligns text to the top of the TextInput
    //marginBottom: 10, // Space below input
  },
  dateTimeContainer: {
    marginTop: 15,
    flexDirection: 'row', // Align date and CVV fields
    justifyContent: 'center',//'space-between',
    width: '100%',
  },
  dateInput: {
    //flex: 1, // Flex to take available space
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 15,
    backgroundColor: '#fff', // White background
    fontSize: 16,
    marginRight: 10, // Margin between date and CVV
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    //borderRadius: 12, // Rounded corners for buttons
    //borderWidth: 2,
    //borderColor: '#007bff', // Blue theme color
    marginHorizontal: 5,
    alignItems: 'center',
    height: 45
  },
  modalButtonText: {
    fontSize: 14,
    //color: '#007bff', // Blue text
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
  },
  toggleText: {
    fontSize: 16,
    color: '#333', // Dark text color
  },
  toggleSwitch: {
    marginLeft: 'auto',
  },
});

export default HomeScreen;