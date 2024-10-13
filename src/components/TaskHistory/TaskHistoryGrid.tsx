import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { format } from 'date-fns';
import globalStyles from '../../style/style'

interface CompletedTasksDate {
  date: string;
  count: number;
}

interface HistoryGridProps {
  completedTasks: CompletedTasksDate[];
  handleDayPress: (date: string) => void;
}

const getColor = (count: number) => {
  if (count > 4) return '#216e39'; // Darkest color
  if (count > 3) return '#30a14e';
  if (count > 2) return '#40c463';
  if (count >= 1 ) return '#9be9a8';
  return '#ebedf0'; // default background color
};

const TaskHistoryGrid: React.FC<HistoryGridProps> = ({ completedTasks, handleDayPress }) => {

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rows = [1, 2, 3, 4, 5, 6];
  const cols = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={[styles.weekDay, globalStyles.textColor]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.gridContainer}>
        {
          rows.map((row, rindex) => {
            return (
              <View key={row} style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {cols.map((col, cindex) => {
                  const currentIndex = rindex * cols.length + cindex;
                  const completedTask = currentIndex < completedTasks.length ? completedTasks[currentIndex] : undefined;
                  const taskDate = completedTask ? completedTask.date : undefined;
                  return (
                    <View style={[styles.gridColumn, {backgroundColor: completedTask ? getColor(completedTask.count): 'transparent'}]}>
                      <TouchableOpacity
                        key={`${rindex}-${cindex}`}
                        style={[styles.dayButton, { backgroundColor: 'transparent' }]}
                        onPress={() => taskDate && handleDayPress(taskDate)}
                      >
                        <Text style={globalStyles.textColor}>{taskDate ? format(new Date(taskDate), 'd') : ''}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const columnMargin = 20;
const columnWidth = Math.floor(screenWidth / 7) - columnMargin;

const styles = StyleSheet.create({
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  gridContainer: {
  },
  gridColumn:{
    height: columnWidth , 
    marginBottom: 10, 
    width: columnWidth,
    justifyContent: 'center'
  },
  dayButton: {
    alignItems: 'center'
  },
  dayText: {
    fontSize: 12
  },
});

export default TaskHistoryGrid;