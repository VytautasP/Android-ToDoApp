import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { RootStackParamList } from './src/navigation/types';
import { Platform, TouchableOpacity } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
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