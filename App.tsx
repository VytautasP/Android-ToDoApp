import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { RootStackParamList } from './src/navigation/types';
import { TouchableOpacity } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator<RootStackParamList>();

export const APP_OPEN_COUNT_KEY = '@todo-completed-tasks-app-open_counter';
export const APP_ADMOB_INTERSTITIAL_ID = 'ca-app-pub-9160717670483486/6469333363'

const App: React.FC = () => {

  const [adLoaded, setAdLoaded] = useState(false)
  const [deliveredNotifications, setDeliveredNotifications] = React.useState<string[]>([]);
  
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : APP_ADMOB_INTERSTITIAL_ID;

  const getAppOpens = async (): Promise<number> => {
    
    try {
      const value = await AsyncStorage.getItem('appOpenCount');
      let count = value ? parseInt(value, 10) : 0;
      count += 1;

      await AsyncStorage.setItem('appOpenCount', count.toString());

      return count;
    } catch (e) {
      console.error('Error accessing AsyncStorage:', e);
      return 0;
    }
  };

  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {

    const adLoadListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdLoaded(true);
        console.log('Interstitial ad loaded');
      }
    );

    const adCloseListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAdLoaded(false);
        interstitial.load(); // Pre-load the next ad
      }
    );

    const adErrorListener = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('Interstitial ad error:', error);
      }
    );

    let appOpenCount = 0;

    const fetchAppOpens = async () => {
      appOpenCount = await getAppOpens();
    };

    fetchAppOpens();

    interstitial.load();

    let showAdd = appOpenCount % 4 === 0;
    
    showAdd = true;

    if (showAdd) {

      if (adLoaded) {
        interstitial.show();
      } else {
        console.log('Interstitial ad not loaded yet, will show when ready');
        const adLoadedListener = interstitial.addAdEventListener(
          AdEventType.LOADED,
          () => {
            interstitial.show();
            adLoadedListener(); // Remove listener after showing ad
          }
        );
      }

    }

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
      adLoadListener();
      adCloseListener();
      adErrorListener();
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