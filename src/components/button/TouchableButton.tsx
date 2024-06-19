import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    onClick: () => void;
    text: string;
}

const TouchableButton = ({ onClick, text }: ButtonProps) => {
    return (
        <TouchableOpacity style={styles.buttonStyle} onPress={onClick}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#6200ee',
        padding: 15,
        marginVertical: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      }
});

export default TouchableButton;