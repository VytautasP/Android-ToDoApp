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


const Task: React.FC<TaskProps> = ({ task, completeTask, deleteTask, scheduleTask } : TaskProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isCompleteTaskModalVisible, setIsCompleteTaskModalVisible] = useState(false);
  const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] = useState(false);
  const [isScheduleTaskModalVisible, setScheduleTaskModalVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date(task.date));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const onScheduleTask = () => {
   //TODO: check if remainder pops up if app is closed
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
    color: '#333'
  },
  taskTextCompleted: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default Task;
