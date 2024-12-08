import React, { useState } from 'react'
import { View, TouchableOpacity, Text, LayoutAnimation, StyleSheet, ViewProps, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { TaskType } from '../../models/task';

interface TaskContentBoxProps {
  task: TaskType,
  containerStyle?: StyleProp<ViewStyle>,
  boxStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  collapsed?: boolean
}

const TaskContentBox = (props: TaskContentBoxProps) => {
  const { task, containerStyle, boxStyle, textStyle, collapsed } = props;
  const enableCollapse = collapsed ?? true;
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {

    if(!enableCollapse) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <>
      <View style={containerStyle}>
        <TouchableOpacity onPress={toggleExpanded} style={[styles.contentArea, boxStyle]}>
          <Text style={[styles.taskText, textStyle] }>
            {!enableCollapse ||expanded || task.title.length < 35 ? task.title : task.title.slice(0, 35) + '...'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default TaskContentBox;

const styles = StyleSheet.create({
  contentArea: {
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333'
  },
  taskTextCompleted: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray'
  },
});