import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import TouchableButton from '../button/TouchableButton';
import DatePicker from 'react-native-date-picker';

interface AddTaskModalProps {
    isModalVisible: boolean;
    onConfirm: (task: string, date: Date) => void;
    onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = (props: AddTaskModalProps) => {
    const {isModalVisible, onConfirm, onClose} = props;
    const [task, setTask] = useState('');
    const [date, setDate] = useState(new Date());

    const onModalConfirm = () => {
 
        onConfirm(task, date);
        setTask('');
        setDate(new Date());
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Task Description</Text>

                        {/* Line */}
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                width: '98%',
                            }} />

                        <DatePicker date={date} mode="date" onDateChange={setDate} dividerColor='#c6c6c6' />

                        <View style={styles.section}>
                            <TextInput
                                multiline={true}
                                style={styles.input}
                                placeholder="Enter your task here..."
                                value={task}
                                onChangeText={setTask}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableButton
                                buttonStyle={styles.modalButton}
                                buttonTextStyle={styles.modalButtonText}
                                text='OK'
                                onClick={onModalConfirm} />

                            <TouchableButton
                                buttonStyle={styles.modalButton}
                                buttonTextStyle={styles.modalButtonText}
                                text='Cancel'
                                onClick={onClose}
                            />
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken background
    },
    modalView: {
      width: '90%', // Responsive width
      maxWidth: 400, // Maximum width
      backgroundColor: '#fff', // White background
      borderRadius: 12, // Rounded corners
      paddingVertical: 30, // Padding
      paddingHorizontal: 20,
      alignItems: 'center',
      elevation: 10, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333', // Text color
      textAlign: 'center',
    },
    section: {
      width: '100%',
      //padding: 20,
      marginBottom: 15, // Space between sections
    },
    input: {
      height: 100,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10, // Rounded corners for input fields
      paddingHorizontal: 15,
      backgroundColor: '#fff', // White background for inputs
      fontSize: 16, // Consistent font size
      textAlignVertical: 'top', // Aligns text to the top of the TextInput
      //marginBottom: 10, // Space below input
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 10,
      //borderRadius: 12, // Rounded corners for buttons
      //borderWidth: 2,
      //borderColor: '#007bff', // Blue theme color
      marginHorizontal: 5,
      alignItems: 'center',
      height: 45
    },
    modalButtonText: {
      fontSize: 14,
      //color: '#007bff', // Blue text
      fontWeight: 'bold',
    }
  });

export default AddTaskModal;