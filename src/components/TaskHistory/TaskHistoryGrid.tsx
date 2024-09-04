import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';

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
  if (count > 1) return '#9be9a8';
  return '#ebedf0'; // Lightest color
};

const TaskHistoryGrid: React.FC<HistoryGridProps> = ({ completedTasks, handleDayPress }) => {

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  return (
    <View>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.gridContainer}>
        {completedTasks.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.day, { backgroundColor: day.date ? getColor(day.count) : 'transparent' }]}
            onPress={() => day.date && handleDayPress(day.date)}
          >
            <Text style={styles.dayText}>{day.date ? format(new Date(day.date), 'd') : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  day: {
    width: 30,
    height: 30,
    margin: 8, // Adjust margin to fit 7 items per row
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
  },
});

export default TaskHistoryGrid;