import React from 'react';
import { View, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet} from 'react-native';

interface ModalBoxProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedDate: string | null;
  tasksForSelectedDate: { title: string; completed: boolean; date: string }[];
}

const TaskHistoryDetails: React.FC<ModalBoxProps> = ({
  modalVisible,
  setModalVisible,
  selectedDate,
  tasksForSelectedDate
}) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
    >
      <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tasks for {selectedDate}</Text>
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map((task, index) => (
                  <Text key={index} style={styles.taskText}>{task.title}  <Text style={styles.completeButton}>✔</Text></Text>
                ))
              ) : (
                <Text style={styles.taskText}>No tasks completed on this day.</Text>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
  }
});

export default TaskHistoryDetails;