import React from 'react'
import { TaskType } from '../models/task';
import { StyleSheet, Text, View } from 'react-native';
import globalStyles from '../style/style'
import MasonryList from '@react-native-seoul/masonry-list';
import TaskContentBox from '../components/Task/TaskContentBox';
import { ParamListBase, RouteProp } from '@react-navigation/native';

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
  
  const { completionDate, completedTasks} = props.route.params;

  return (
    <View style={styles.modalContainer}>
      <Text style={[styles.modalTitle, globalStyles.textColor]}>Tasks for {completionDate}</Text>
      {completedTasks && completedTasks.length > 0 ? (


        <MasonryList
          data={completedTasks}
          //keyExtractor={(item): string => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => {
            return (
              // <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <TaskContentBox containerStyle={{ flex: 1, marginBottom: 0 }} boxStyle={styles.taskContentBox} textStyle={{ color: 'gray' }} task={item as TaskType} collapsed={false} />
              //  </View>
            );
          }
          }
        //refreshing={isLoadingNext}
        //onRefresh={() => refetch({first: ITEM_CNT})}
        //onEndReachedThreshold={0.1}
        //onEndReached={() => loadNext(ITEM_CNT)}
        />

      ) : (
        <Text style={[styles.taskText, globalStyles.textColor]}>No tasks completed on this day.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  completeButton: {
    fontSize: 18,
    color: 'green',
  },
  taskContentBox: {
    margin: 10,
    backgroundColor: '#fbfbfb',
    borderRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  }
});

export default CompletedTasksScreen;