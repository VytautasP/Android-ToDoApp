import * as React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { useEffect, useState } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CompletedTasksScreen from './src/screens/CompletedTasksScreen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from './src/constants/colors';

const Tab = createBottomTabNavigator();

export const APP_OPEN_COUNT_KEY = '@todo-completed-tasks-app-open_counter';
export const APP_ADMOB_INTERSTITIAL_ID = 'ca-app-pub-9160717670483486/6469333363'
export const AD_SHOW_EVERY_OPEN = 3;

const navigationRef = React.createRef<NavigationContainerRef<any>>();
export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

const App: React.FC = () => {

  const [adLoaded, setAdLoaded] = useState(false)
  const [deliveredNotifications, setDeliveredNotifications] = React.useState<string[]>([]);

  //const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : APP_ADMOB_INTERSTITIAL_ID;

  const adUnitId = TestIds.INTERSTITIAL;

  //const adUnitId = 'ca-app-pub-9160717670483486/6469333363';

  const getAppOpens = async (): Promise<number> => {

    try {
      const value = await AsyncStorage.getItem(APP_OPEN_COUNT_KEY);
      let count = value ? parseInt(value, 10) : 0;
      count += 1;

      await AsyncStorage.setItem(APP_OPEN_COUNT_KEY, count.toString());

      return count;
    } catch (e) {
      return 1;
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

    const showAdd = async () => {

      let appOpens = await getAppOpens();
      let showAdd = appOpens % AD_SHOW_EVERY_OPEN === 0;

      if (showAdd) {

        if (adLoaded) {
          interstitial.show();
        } else {
          const adLoadedListener = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
              interstitial.show();
              adLoadedListener(); // Remove listener after showing ad
            }
          );
        }

      }

    };

    showAdd();

    interstitial.load();

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {

      if (type === EventType.DELIVERED) {
        // The notification has been delivered/displayed

        const taskId = detail.notification!.data!.taskId as string;

        setDeliveredNotifications((prev) => {
          const newState = [...prev, taskId];
          return newState;
        });

      }

    });

    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
      unsubscribe();
      adLoadListener();
      adCloseListener();
      adErrorListener();
    };

  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator initialRouteName="Tasks">
          <Tab.Screen name="Tasks"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="playlist-check" color={color} size={size} />
              )
            }}
          >
            {(props) => <HomeScreen {...props} deliveredNotifications={deliveredNotifications} />}
          </Tab.Screen>
          <Tab.Screen name="History"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="history" color={color} size={size} />
              )
            }}
          />
          <Tab.Screen name="CompletedTasks" options={({ navigation }) => ({
            title: 'Completed tasks',
            tabBarButton: () => null,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('History')} style={{ marginLeft: 10 }}>
                <MaterialIcon name="arrow-back" size={30} color={Colors.Primary} />
              </TouchableOpacity>
            )
          })
          } >
            {(props) => (
              <CompletedTasksScreen {...props} route={{ ...props.route, params: { completionDate: '', completedTasks: [] } }} />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;