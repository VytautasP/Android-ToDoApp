import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { RootStackParamList } from './src/navigation/types';
import { TouchableOpacity } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { useEffect } from 'react';
import notifee, { EventType } from '@notifee/react-native';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {

  const [deliveredNotifications, setDeliveredNotifications] = React.useState<string[]>([]);

  useEffect(() => {

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {

      if (type === EventType.DELIVERED) {
        // The notification has been delivered/displayed
        console.log('Foreground notification delivered:', detail.notification);
        
        const taskId = detail.notification!.data!.taskId as string;

        setDeliveredNotifications((prev) => {
          const newState = [...prev, taskId];
          return newState;
        });

      }

    });

    return () => {
      console.log('Cleaning up foreground event listener');
      unsubscribe();
    };

  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} deliveredNotifications={deliveredNotifications} />}
        </Stack.Screen>
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                <Icon name="arrow-back" size={30} color="#6200ee" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;