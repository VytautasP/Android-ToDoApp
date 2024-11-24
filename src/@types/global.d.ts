declare module 'react-native-switch-selector' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle, TextStyle } from 'react-native';
  
    interface SwitchSelectorProps {
      options: Array<{
        label: string;
        value: string | number;
        testID?: string;
        accessibilityLabel?: string;
      }>;
      initial?: number;
      onPress?: (value: string | number) => void;
      textColor?: string;
      selectedColor?: string;
      buttonColor?: string;
      backgroundColor?: string;
      borderColor?: string;
      hasPadding?: boolean;
      valuePadding?: number;
      height?: number;
      borderRadius?: number;
      animationDuration?: number;
      fontSize?: number;
      selectedTextStyle?: StyleProp<TextStyle>;
      textStyle?: StyleProp<TextStyle>;
      style?: StyleProp<ViewStyle>;
      disableValueChangeOnPress?: boolean;
      bold?: boolean;
      disabled?: boolean;
      borderWidth?: number;
      buttonMargin?: number;
    }
  
    export default class SwitchSelector extends Component<SwitchSelectorProps> {}
  }