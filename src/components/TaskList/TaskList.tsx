import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Task from '../Task/Task';
import { TaskType } from '../../models/task';
import globalStyles from '../../style/style'

interface TaskListProps {
    tasks: TaskType[];
    completeTask: (id: string) => void;
    deleteTask: (id: string) => void;
    scheduleTask: (id: string, reminderDate: Date) => void;
    cancelScheduleTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, completeTask, deleteTask, scheduleTask, cancelScheduleTask } : TaskListProps) => {

    const groupedTasks = tasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
        (acc[task.date] = acc[task.date] || []).push(task);
        return acc;
      }, {});

    return (
        <>
            <Text style={[styles.title, globalStyles.textColor]}>To-Do List</Text>
            <ScrollView style={styles.scrollView}>
                {Object.keys(groupedTasks).map((date) => (
                    <View key={date}>
                        <Text style={[styles.dateHeader, globalStyles.textColor]}>{date}</Text>
                        {groupedTasks[date].map((task, index) => (
                            <Task
                                key={task.id}
                                task={task}
                                completeTask={completeTask}
                                deleteTask={deleteTask}
                                scheduleTask={scheduleTask}
                                cancelScheduleTask={cancelScheduleTask}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20
    },
    scrollView: {
      flex: 1,
      marginBottom: 20,
    },
    dateHeader: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    }
  });

export default TaskList;