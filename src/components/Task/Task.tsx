import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { TaskType } from '../../models/task';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import DatePicker from 'react-native-date-picker';

interface TaskProps {
  task: TaskType;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  scheduleTask: (id: string, reminderDate: Date) => void;
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

const scheduleReminderWithTrigger = async (task: TaskType) => {
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
      body: task.title,
      android: {
        channelId: channelId,
        smallIcon: 'ic_check_list', // optional, defaults to 'ic_launcher'.
        color: '#808000',
      },
    },
    trigger
  );
};

const Task: React.FC<TaskProps> = ({ task, completeTask, deleteTask, scheduleTask } : TaskProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isCompleteTaskModalVisible, setIsCompleteTaskModalVisible] = useState(false);
  const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] = useState(false);
  const [isScheduleTaskModalVisible, setScheduleTaskModalVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date(task.date));

  const toggleExpanded = () => {
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const onScheduleTask = () => {
   //TODO: fix scheduling check if reminderDate is in the future
    scheduleTask(task.id, reminderDate); 
    setScheduleTaskModalVisible(false);
  }

  return (
    <>
      <View style={styles.taskContainer}>
        {/* Action Bar Area */}
        <View style={styles.actionBarArea}>

          {/* Complete task button */}
          <TouchableOpacity onPress={() => setIsCompleteTaskModalVisible(true)} style={styles.actionButton}>
            <Icon name="check-circle" size={20} color="green" />
          </TouchableOpacity>

          {/* Delete task button */}
          <TouchableOpacity onPress={() => setIsDeleteTaskModalVisible(true)} style={styles.actionButton}>
            <IconCommunity name="delete-circle" size={20} color="red" />
          </TouchableOpacity>

          {/* Schedule task button */}
          <TouchableOpacity onPress={() => setScheduleTaskModalVisible(true)} style={styles.actionButton}>
            <Icon name="notifications" size={20} color="#6200ee" />
          </TouchableOpacity>

        </View>

        {/* Content Area */}
        <TouchableOpacity onPress={toggleExpanded} style={styles.contentArea}>
          <Text style={task.completed ? styles.taskTextCompleted : styles.taskText}>
            {expanded || task.title.length < 35 ? task.title : task.title.slice(0, 35) + '...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Complete Task confirm modal */}
      <ConfirmPopup
        isModalVisible={isCompleteTaskModalVisible}
        onConfirm={() => { completeTask(task.id) }}
        OnCancel={() => { setIsCompleteTaskModalVisible(false) }}
        title="Complete task?"
        subtitle="Task will be removed from the list and moved to history."
      >
        <IconFeather name="check-circle" size={60} color="green" />
      </ConfirmPopup>

      {/* Delete Task confirm Modal */}
      <ConfirmPopup
        isModalVisible={isDeleteTaskModalVisible}
        onConfirm={() => { deleteTask(task.id) }}
        OnCancel={() => { setIsDeleteTaskModalVisible(false) }}
        title="Delete task?"
        subtitle="Task will be removed from the list."
      >
        <IconFeather name="alert-triangle" size={60} color="orange" />
      </ConfirmPopup>

      {/* Schedule Task confirm Modal */}
      <ConfirmPopup
        isModalVisible={isScheduleTaskModalVisible}
        onConfirm={onScheduleTask}
        OnCancel={() => { setScheduleTaskModalVisible(false) }}
        subtitle='Select the time to schedule the reminder.'
      >
        <DatePicker date={new Date(task.date)} mode="time" onDateChange={setReminderDate} dividerColor='#c6c6c6' />
      </ConfirmPopup>

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
