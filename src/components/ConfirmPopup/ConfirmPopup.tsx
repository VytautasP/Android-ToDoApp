import React from 'react';
import { Modal, StyleProp, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import TouchableButton from '../button/TouchableButton';

interface ConfirmPopupProprs {
    isModalVisible: boolean;
    title? : string;
    subtitle?: string;
    onConfirm: () => void;
    OnCancel: () => void;
    children: React.ReactNode;
    buttonOkStyle?: StyleProp<ViewStyle>;
    buttonOkTextStyle?: StyleProp<TextStyle>;
    buttonCancelStyle?: StyleProp<ViewStyle>;
    buttonCancelTextStyle?: StyleProp<TextStyle>;
}

const ConfirmPopup: React.FC<ConfirmPopupProprs> = (props: ConfirmPopupProprs) => {

  const { isModalVisible, title, subtitle, onConfirm, OnCancel, children, buttonOkStyle, buttonOkTextStyle, buttonCancelStyle, buttonCancelTextStyle } = props;

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

            <View style={styles.childrenContainer}>
              {children}
            </View>

            {title?.length && title.length > 0 ? (<Text style={styles.modalTitle}>

              {title?.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {'\n'}
                </React.Fragment>
              ))}

            </Text>)
              : (<></>)
            }

            {subtitle?.length && subtitle.length > 0 ? (<Text style={styles.modalSubTitle}>

              {subtitle?.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {'\n'}
                </React.Fragment>
              ))}

            </Text>
            ) : (<></>)
            }

            <View style={styles.buttonContainer}>

              <TouchableButton
                buttonStyle={[styles.modalButton, styles.buttonCancel, buttonCancelStyle]}
                buttonTextStyle={[styles.modalButtonText, styles.buttonCancelText, buttonCancelTextStyle]}
                text='Cancel'
                onClick={OnCancel}
              />

              <TouchableButton
                buttonStyle={[styles.modalButton, buttonOkStyle]}
                buttonTextStyle={[styles.modalButtonText, buttonOkTextStyle]}
                text='OK'
                onClick={onConfirm} />

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
    childrenContainer: {
        width: '100%',
        height: 'auto',
        marginBottom: 10,
        alignItems: 'center'
      },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
      textAlign: 'center',
    },
    modalSubTitle: {
      fontSize: 14,
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
    },
    section: {
      width: '100%',
      marginBottom: 15
    },
    input: {
      height: 100,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      fontSize: 16,
      textAlignVertical: 'top'
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
    buttonCancel: {
      borderWidth: 2,
      borderColor: '#E1D8FD',
      backgroundColor: 'transparent',
    },
    buttonCancelText :{
      color: '#7C51FF'//'#AC91FE'
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    }
  });

export default ConfirmPopup;