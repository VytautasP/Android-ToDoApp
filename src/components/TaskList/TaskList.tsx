import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Task from '../Task/Task';
import { TaskType } from '../../models/task';
import globalStyles from '../../style/style'

interface TaskFullListProps {
    tasks: TaskType[];
    completeTask: (id: string) => void;
    editTask: (task: TaskType) => void;
    deleteTask: (id: string) => void;
    scheduleTask: (id: string, reminderDate: Date) => void;
    cancelScheduleTask: (id: string) => void;
}

const TaskFullList: React.FC<TaskFullListProps> = (props: TaskFullListProps) => {

  const { tasks, completeTask, editTask, deleteTask, scheduleTask, cancelScheduleTask } = props;

  const groupedTasks = useMemo(() => {

    let sortedTasks = tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let groupedTasks = sortedTasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
      (acc[task.date] = acc[task.date] || []).push(task);
      return acc;
    }, {})

    return groupedTasks;

  }, [tasks]);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedTasks).map((date) => (
          <View key={date}>
            <Text style={[styles.dateHeader, globalStyles.textColor]}>{date}</Text>
            {groupedTasks[date].map((task, index) => (
              <Task
                key={task.id}
                task={task}
                completeTask={completeTask}
                editTask={editTask}
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

export default TaskFullList;