import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskProps {
  task: {
    title: string;
    completed: boolean;
  };
  index: number;
  completeTask: (index: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, completeTask }) => {
  return (
    <View style={styles.taskContainer}>
      <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => completeTask(index)}>
        <Text style={styles.completeButton}>✔</Text>
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
    fontFamily: 'Roboto',
  },
  taskTextCompleted: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
    fontFamily: 'Roboto',
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
  },
});

export default Task;