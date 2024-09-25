import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Alert } from 'react-native';
import { TaskType } from '../../models/task';
import TaskActionBar from './TaskActionBar';

interface TaskProps {
  task: TaskType;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  scheduleTask: (id: string, reminderDate: Date) => void;
  cancelScheduleTask: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, completeTask, deleteTask, scheduleTask, cancelScheduleTask } : TaskProps) => {

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <>
      <View style={styles.taskContainer}>
         
         <TaskActionBar task={task} completeTask={completeTask} deleteTask={deleteTask} scheduleTask={scheduleTask} cancelScheduleTask={cancelScheduleTask} />

        {/* Content Area */}
        <TouchableOpacity onPress={toggleExpanded} style={styles.contentArea}>
          <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
            {expanded || task.title.length < 35 ? task.title : task.title.slice(0, 35) + '...'}
          </Text>
        </TouchableOpacity>
      </View>

      

    </>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contentArea: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333'
  },
  taskTextCompleted: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray'
  },
});

export default Task;
