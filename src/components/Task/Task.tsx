import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  await notifee.requestPermission();

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
  await notifee.requestPermission();

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
    trigger
  );
};

const Task: React.FC<TaskProps> = ({ task, index, completeTask }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.taskContainer}>
      {/* Action Bar Area */}
      <View style={styles.actionBarArea}>
        <TouchableOpacity onPress={() => completeTask(index)} style={styles.actionButton}>
          <Icon name="check-circle" size={20} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => scheduleReminderWithTrigger(task.title)}
          style={styles.actionButton}
        >
          <Icon name="notifications" size={20} color="#6200ee" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <TouchableOpacity onPress={toggleExpanded} style={styles.contentArea}>
        <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
          {expanded ? task.title : task.title.split(' ').slice(0, 10).join(' ') + '...'}
        </Text>
      </TouchableOpacity>
    </View>
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
  actionBarArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentArea: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    //fontFamily: 'Kalam-Regular'
  },
  taskTextCompleted: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
    //fontFamily: 'Kalam-Regular',
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default Task;
