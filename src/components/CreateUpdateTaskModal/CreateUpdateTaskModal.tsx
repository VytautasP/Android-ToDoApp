import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import TouchableButton from '../button/TouchableButton';
import DatePicker from 'react-native-date-picker';
import globalStyles from '../../style/style'
import { TaskType } from '../../models/task';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

interface CreateUpdateTaskModalProps {
    isModalVisible: boolean;
    onConfirm: (task: TaskType) => void;
    onClose: () => void;
    taskToEdit?: TaskType;
}

const CreateUpdateTaskModal: React.FC<CreateUpdateTaskModalProps> = (props: CreateUpdateTaskModalProps) => {
  const { isModalVisible, onConfirm, onClose, taskToEdit } = props;
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(new Date());

  useEffect(() => {
    if (taskToEdit) {
      setTaskDescription(taskToEdit.title);
      setTaskDate(new Date(taskToEdit.date));
    }
  }, [isModalVisible, taskToEdit]);

  const onModalConfirm = () => {

    let returnTask : TaskType =  {
      id: uuid(),
      title: taskDescription,
      completed: false,
      date: format(taskDate, "yyyy-MM-dd")
    };

    if (taskToEdit) {
      returnTask.id = taskToEdit.id;
      returnTask.reminderId = taskToEdit.reminderId;
      returnTask.reminderDate = taskToEdit.reminderDate;
    }

    onConfirm(returnTask);
    setTaskDescription('');
    setTaskDate(new Date());
  }

  const onModalClose = () => {

    onClose();
    setTaskDescription('');
    setTaskDate(new Date());
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onModalClose}
    >
      <TouchableWithoutFeedback onPress={onModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={[styles.modalTitle, globalStyles.textColor]}>{taskToEdit ? "Edit task" : "New task description"}</Text>

            {/* Line */}
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                width: '98%',
              }} />

            <DatePicker theme="light" date={taskDate} mode="date" onDateChange={setTaskDate} dividerColor='#c6c6c6' />

            <View style={styles.section}>
              <TextInput
                multiline={true}
                style={[styles.input, globalStyles.textColor]}
                placeholder="Enter your task here..."
                placeholderTextColor="#c0c0c0"
                value={taskDescription}
                onChangeText={setTaskDescription}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableButton
                buttonStyle={[styles.modalButton, styles.buttonCancel]}
                buttonTextStyle={[styles.modalButtonText, styles.buttonCancelText]}
                text='Cancel'
                onClick={onModalClose}
              />

              <TouchableButton
                buttonStyle={styles.modalButton}
                buttonTextStyle={styles.modalButtonText}
                text='OK'
                onClick={onModalConfirm} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingVertical: 30,
      paddingHorizontal: 20,
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    section: {
      width: '100%',
      marginBottom: 15,
    },
    input: {
      height: 100,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      fontSize: 16,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 10,
      marginHorizontal: 5,
      alignItems: 'center',
      height: 45
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    buttonCancel: {
      borderWidth: 2,
      borderColor: '#E1D8FD',
      backgroundColor: 'transparent',
    },
    buttonCancelText :{
      color: '#7C51FF'//'#AC91FE'
    }
  });

export default CreateUpdateTaskModal;
