import React from 'react';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import TouchableButton from '../button/TouchableButton';

interface ConfirmPopupProprs {
    isModalVisible: boolean;
    title : string;
    subtitle?: string;
    onConfirm: () => void;
    OnCancel: () => void;
    children: React.ReactNode;
}

const ConfirmPopup: React.FC<ConfirmPopupProprs> = (props: ConfirmPopupProprs) => {

  const { isModalVisible, title, subtitle, onConfirm, OnCancel, children } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={OnCancel}
    >
      <TouchableWithoutFeedback onPress={OnCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>

            <View style={styles.icon}>
              {children}
            </View>

            <Text style={styles.modalTitle}>

              {title.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {'\n'}
                </React.Fragment>
              ))}

            </Text>

            <Text style={styles.modalSubTitle}>

              {subtitle?.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {'\n'}
                </React.Fragment>
              ))}

            </Text>

            <View style={styles.buttonContainer}>
              <TouchableButton
                buttonStyle={styles.modalButton}
                buttonTextStyle={styles.modalButtonText}
                text='OK'
                onClick={onConfirm} />

              <TouchableButton
                buttonStyle={styles.modalButton}
                buttonTextStyle={styles.modalButtonText}
                text='Cancel'
                onClick={OnCancel}
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
    icon: {
        width: 70,
        height: 70,
        marginBottom: 10,
      },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333', // Text color
      textAlign: 'center',
    },
    modalSubTitle: {
      fontSize: 14,
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

export default ConfirmPopup;