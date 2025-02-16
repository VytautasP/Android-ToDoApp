import React, { useCallback, useMemo } from 'react'
import { TaskType } from '../../models/task';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { Colors } from '../../constants/colors';
import globalStyles from '../../style/style'
import Task from '../Task/Task';
import { MarkedDates } from 'react-native-calendars/src/types';

interface MonthTaskListProps {
    tasks: TaskType[];
    completeTask: (id: string) => void;
    editTask: (task: TaskType) => void;
    deleteTask: (id: string) => void;
    scheduleTask: (id: string, reminderDate: Date) => void;
    cancelScheduleTask: (id: string) => void;
}

const getAgendaTaskItems = (tasks: TaskType[]): any[] => {

    let agendaItems: any[] = [];
    let sortedTasks = tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let groupedTasks = sortedTasks.reduce((acc: { [key: string]: TaskType[] }, task) => {
        (acc[task.date] = acc[task.date] || []).push(task);
        return acc;
    }, {});

    for (const date in groupedTasks) {
        let agendaItem = {
            title: date,
            data: groupedTasks[date]
        }
        agendaItems.push(agendaItem);
    }
    return agendaItems;

}

const getMarkedDates = (tasks: TaskType[]): MarkedDates => {

    const uniqueDates = Array.from(new Set(tasks.map(task => task.date)));
    const markedDates = uniqueDates.reduce((acc, date) => { acc[date] = { selected: false, marked: true, dotColor: Colors.Primary, type: 'period' }; return acc; }, {} as MarkedDates);

    return markedDates;
  }

const MonthTaskList: React.FC<MonthTaskListProps> = (props: MonthTaskListProps) => {

    const { tasks, completeTask, editTask, deleteTask, scheduleTask, cancelScheduleTask } = props;

    const agendItems =  useMemo(()=> {
        return getAgendaTaskItems(tasks);
    }, [tasks]);

    const markedDates = useMemo(() => {
        return getMarkedDates(tasks);
    }, [tasks]);

    const renderItem = useCallback((item: TaskType) => {
        return <Task
            key={item.id}
            task={item}
            completeTask={completeTask}
            editTask={editTask}
            deleteTask={deleteTask}
            scheduleTask={scheduleTask}
            cancelScheduleTask={cancelScheduleTask}
        />
    }, [tasks]);

    const renderSectionHeaderItem = useCallback((section: any) => {

        return <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section as unknown as string}</Text>
        </View>

    }, [tasks]);

    // @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
    ExpandableCalendar.defaultProps = undefined;

    return (
        <CalendarProvider date={new Date().toDateString()}>
            <View style={styles.calendarWrapper}>

                <ExpandableCalendar
                    calendarWidth={Dimensions.get("window").width - 20}
                    initialPosition={ExpandableCalendar.positions.CLOSED}
                    theme={{ arrowColor: Colors.Primary, todayTextColor: Colors.Primary, selectedDayBackgroundColor: Colors.Primary, selectedDayTextColor: 'white' }}
                    firstDay={1}
                    markedDates={markedDates}
                />
            </View>
            <AgendaList
                sections={agendItems}
                renderItem={(item) => renderItem(item.item as TaskType)}
                theme={{ textSectionTitleColor: 'black' }}
                renderSectionHeader={(section) => renderSectionHeaderItem(section)}
            />
        </CalendarProvider>
    )
}

export default MonthTaskList;

const styles = StyleSheet.create({
    calendarWrapper: {
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 4,
        backgroundColor: Colors.ActionBarBackground,
        borderRadius: 10,
        height: 40
    },
    sectionHeaderText: {
        color: globalStyles.textColor.color,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    }
});