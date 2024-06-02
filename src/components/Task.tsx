// src/components/Task.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskProps {
  task: {
    title: string;
    completed: boolean;
  };
  index: number;
  completeTask: (index: number) => void;
  deleteTask: (index: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, completeTask, deleteTask }) => {
  return (
    <View style={styles.taskContainer}>
      <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
        {task.title}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => completeTask(index)}>
          <Text style={styles.completeButton}>✔</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(index)}>
          <Text style={styles.deleteButton}>✘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  taskText: {
    fontSize: 18,
    fontFamily: 'Roboto-BlackItalic'
  },
  taskTextCompleted: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
    marginRight: 10,
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
  },
});

export default Task;