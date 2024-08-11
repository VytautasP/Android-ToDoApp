import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    onClick: () => void;
    text: string;
    buttonStyle?: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
}

const TouchableButton = ({ onClick, text, buttonStyle, buttonTextStyle }: ButtonProps) => {
    return (
        <TouchableOpacity style={[styles.buttonStyle, buttonStyle]} onPress={onClick}>
        <Text style={[styles.buttonText, buttonTextStyle]}>{text}</Text>
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