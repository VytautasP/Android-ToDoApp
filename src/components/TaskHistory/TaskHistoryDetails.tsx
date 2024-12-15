import React from 'react';
import { View, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import globalStyles from '../../style/style'
import { TaskType } from '../../models/task';
import TaskContentBox from '../Task/TaskContentBox';
import MasonryList from '@react-native-seoul/masonry-list';
import { Colors } from '../../constants/colors';

interface ModalBoxProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedDate: string | null;
  tasksForSelectedDate: TaskType[];
}

const TaskHistoryDetails: React.FC<ModalBoxProps> = ({ modalVisible, setModalVisible, selectedDate, tasksForSelectedDate}) => {
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
              <Text style={[styles.modalTitle, globalStyles.textColor]}>Tasks for {selectedDate}</Text>
              {tasksForSelectedDate.length > 0 ? (

                <MasonryList
                  data={tasksForSelectedDate}
                  //keyExtractor={(item): string => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item })  => {
                    return (
                        <TaskContentBox containerStyle={{ flex: 1, marginBottom: 0 }} boxStyle={styles.taskContentBox} textStyle={{ color: 'gray' }} task={item as TaskType} collapsed={false} />
                    );
                  }
                  }
                />

              ) : (
                <Text style={[styles.taskText, globalStyles.textColor]}>No tasks completed on this day.</Text>
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
    width: '90%',
    height: '80%',
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
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: Colors.Primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
  },
  taskContentBox: {
    margin: 10,
    backgroundColor: '#fbfbfb',
    borderRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  }
});

export default TaskHistoryDetails;