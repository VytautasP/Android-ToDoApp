import React from 'react'
import { TaskType } from '../models/task';
import { StyleSheet, Text, View } from 'react-native';
import globalStyles from '../style/style'
import MasonryList from '@react-native-seoul/masonry-list';
import TaskContentBox from '../components/Task/TaskContentBox';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../constants/colors';

interface CompletedTasksScreenProps {
   route: RouteProp<ParamListBase, "CompletedTasks"> & {
     params: {
       completionDate: string;
       completedTasks: TaskType[];
     };
   };
   navigation: any;
}

const CompletedTasksScreen : React.FC<CompletedTasksScreenProps> = (props: CompletedTasksScreenProps)  => {
  const route = useRoute<RouteProp<ParamListBase>>();
  const { completionDate, completedTasks } = route.params as { completionDate: string, completedTasks: TaskType[] };

  return (
    <View style={styles.screenContainer}>
      <Text style={[styles.screenTitle, globalStyles.textColor]}>Tasks for {completionDate}</Text>
      {completedTasks && completedTasks.length > 0 ? (
        <MasonryList
          data={completedTasks}
          numColumns={2}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => {
            return (
               
              <View style ={{borderRadius: 10, margin: 10, marginTop: 5}}>
              <View style={styles.actionBarArea}>
                <AntDesignIcon name='star' size={15} style={{marginRight: 5}} color={Colors.Primary}/>
                <Text>Completed</Text>
              </View>
              <TaskContentBox containerStyle={{ flex: 1, marginBottom: 0 }} boxStyle={styles.taskContentBox} textStyle={{ color: 'gray' }} task={item as TaskType} collapsed={false} />
              </View>
            );
          }
          }
          style={{borderRadius: 5}}
        />
      ) : (
        <Text style={[styles.taskText, globalStyles.textColor]}>No tasks completed on this day.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ScreensBackground
  },
  actionBarArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: Colors.ActionBarBackground,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 25
  },
  screenTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  taskContentBox: {
    backgroundColor: Colors.TaskContentBackgroundCompleted,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingTop: 5,
    paddingBottom: 9
  }
});

export default CompletedTasksScreen;