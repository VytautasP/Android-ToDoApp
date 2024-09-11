import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import { TaskType } from '../../models/task';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import DatePicker from 'react-native-date-picker';

interface TaskActionBarProps {
    task: TaskType;
    completeTask: (id: string) => void;
    deleteTask: (id: string) => void;
    scheduleTask: (id: string, reminderDate: Date) => void;
}

const TaskActionBar: React.FC<TaskActionBarProps> = ({ task, completeTask, deleteTask, scheduleTask }: TaskActionBarProps) => {
    const [isCompleteTaskModalVisible, setIsCompleteTaskModalVisible] = useState(false);
    const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] = useState(false);
    const [isScheduleTaskModalVisible, setScheduleTaskModalVisible] = useState(false);
    const [reminderDate, setReminderDate] = useState(new Date(task.date));

    const onScheduleTask = () => {

        const now = new Date();

        if (reminderDate < now) {
            Alert.alert('Error', 'Reminder date must be in the future.');
            return;
        }

        scheduleTask(task.id, reminderDate);
        setScheduleTaskModalVisible(false);
    }

    const onScheduleTaskButtonPress = async () => {

        const settings = await notifee.requestPermission();

        console.log(settings.authorizationStatus);

        if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
            Alert.alert('Error', 'Please enable alarm permission to schedule reminders.');
            return;
        }
        setScheduleTaskModalVisible(true)
    }

    const getCurrentTaskDate = (): Date => {
        const now = new Date();
        const dt = new Date(task.date);
        dt.setHours(now.getHours());
        dt.setMinutes(now.getMinutes());

        return dt;
    }

    // Implement the component logic here

    return (
        <>
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
                {/*TODO: jeigu uzdedi reminderi ir atisnaujina taskai su icon nucanelinti reminder, bet po laiko reminderis fire'ina, tai icone neatsirefreshina. Reikia solution */}
                {/*TODO: jeigu taska reikia cancelinti rodyti kita popup */}
                <TouchableOpacity onPress={() => onScheduleTaskButtonPress()} style={styles.actionButton}>
                    {task.reminderId && task.reminderDate
                        ? (<Ionicon name="notifications-off-sharp" size={20} color="#6200ee" />)
                        : (<Icon name="notifications" size={20} color="#6200ee" />)
                    }
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
                <DatePicker date={getCurrentTaskDate()} mode="time" onDateChange={setReminderDate} dividerColor='#c6c6c6' />
            </ConfirmPopup>

        </>
    );
};


const styles = StyleSheet.create({
    actionBarArea: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 4,
      backgroundColor: '#e0e0e0',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    actionButton: {
      marginHorizontal: 5,
    },
  });
  
export default TaskActionBar;