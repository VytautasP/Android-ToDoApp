import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform  } from 'react-native';
import { Notifications } from 'react-native-notifications';

interface TaskProps {
  task: {
    title: string;
    completed: boolean;
  };
  index: number;
  completeTask: (index: number) => void;
}



const scheduleReminder = async (taskTitle: string) => {
  
  Notifications.postLocalNotification(
    {
      identifier: "reminder",
      payload: "Task Reminder",
      title: "Task Reminder",
      body: "Don't forget to complete your task: ",
      sound: "default",
      badge: 1,
      type: "reminder",
      thread: "reminder",
    },
   1);

};

const Task: React.FC<TaskProps> = ({ task, index, completeTask }) => {
  return (
    <View style={styles.taskContainer}>
      <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => completeTask(index)}>
        <Text style={styles.completeButton}>✔</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => scheduleReminder(task.title)} style={styles.reminderButton}>
          <Text style={styles.reminderButtonText}>Add Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    //fontFamily: 'Kalam-Regular'
  },
  taskTextCompleted: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
    //fontFamily: 'Kalam-Regular',
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
  },
  reminderButton: {
    padding: 5,
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  reminderButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Task;