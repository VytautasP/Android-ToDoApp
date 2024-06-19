import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Task from '../Task/Task';
import { TaskType } from '../../models/task';

interface TaskListProps {
    tasks: TaskType[];
    completeTask: (index: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, completeTask }) => {

    const groupedTasks = tasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
        (acc[task.date] = acc[task.date] || []).push(task);
        return acc;
      }, {});

    return (
        <>
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
        </>
    );
};

const styles = StyleSheet.create({
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
    }
  });

export default TaskList;