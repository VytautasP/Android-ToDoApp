import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TaskType } from '../../models/task';
import TaskActionBar from './TaskActionBar';
import TaskContentBox from './TaskContentBox';
import { Colors } from '../../constants/colors';

interface TaskProps {
  task: TaskType;
  completeTask: (id: string) => void;
  editTask: (task: TaskType) => void;
  deleteTask: (id: string) => void;
  scheduleTask: (id: string, reminderDate: Date) => void;
  cancelScheduleTask: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, completeTask, editTask, deleteTask, scheduleTask, cancelScheduleTask } : TaskProps) => {

  return (
    <>
      <View style={styles.taskContainer}>
         
         <TaskActionBar 
           task={task} 
           completeTask={completeTask} 
           editTask={editTask}
           deleteTask={deleteTask} 
           scheduleTask={scheduleTask} 
           cancelScheduleTask={cancelScheduleTask} />

        {/* Content Area */}
        <TaskContentBox task={task}  />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    margin: 10,
    backgroundColor: Colors.TaskContentBackground,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  }
});

export default Task;
