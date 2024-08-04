import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

interface TaskProps {
  task: {
    title: string;
    completed: boolean;
  };
  index: number;
  completeTask: (index: number) => void;
}


const scheduleReminder = async (taskTitle: string) => {

   // Request permissions (required for iOS)
   await notifee.requestPermission()

   // Create a channel (required for Android)
   const channelId = await notifee.createChannel({
     id: 'default',
     name: 'Default Channel',
   });

   // Display a notification
   await notifee.displayNotification({
     title: 'ToDo Task Reminder',
     body: taskTitle,
     android: {
       channelId,
       smallIcon: 'ic_check_list', // optional, defaults to 'ic_launcher'.
       color: '#808000',
       // pressAction is needed if you want the notification to open the app when pressed
       pressAction: {
         id: 'default',
       },
     },
   });

};

const scheduleReminderWithTrigger = async (taskTitle: string) => {

  await notifee.requestPermission()

  const date = new Date(Date.now());
  date.setMinutes(date.getMinutes() + 2);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    // Create a channel (required for Android)
   const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'ToDo Task Reminder',
        body: taskTitle,
        android: {
          channelId: channelId,
          smallIcon: 'ic_check_list', // optional, defaults to 'ic_launcher'.
          color: '#808000',
        },
      },
      trigger,
    );

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
      <TouchableOpacity onPress={() => scheduleReminderWithTrigger(task.title)} style={styles.reminderButton}>
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