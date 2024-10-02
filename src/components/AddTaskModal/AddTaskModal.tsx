import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import TouchableButton from '../button/TouchableButton';
import DatePicker from 'react-native-date-picker';
import globalStyles from '../../style/style'

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

    const onModalClose = () => {

        onClose();
        setTask('');
        setDate(new Date());
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
                        <Text style={[styles.modalTitle, globalStyles.textColor]}>Task Description</Text>

                        {/* Line */}
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                width: '98%',
                            }} />

                        <DatePicker theme="light" date={date} mode="date" onDateChange={setDate} dividerColor='#c6c6c6'/>

                        <View style={styles.section}>
                            <TextInput
                                multiline={true}
                                style={[styles.input, globalStyles.textColor]}
                                placeholder="Enter your task here..."
                                placeholderTextColor="#c0c0c0" 
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
                                onClick={onModalClose}
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
    }
  });

export default AddTaskModal;