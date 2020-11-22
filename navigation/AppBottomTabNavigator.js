import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import HistoryScreen from '../screens/history/HistoryScreen';
import ReceiptDetailsScreen from '../screens/history/ReceiptDetailsScreen';
import VerifyScreen from '../screens/scan/VerifyScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import takeImage from '../screens/scan/takeImage';
import Colors from '../constants/Colors';
import ClassifyScreen from '../screens/scan/ClassifyScreen';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'merchant',
    fontSize: Platform.OS === 'android' ? 30 : 35,
  },
  headerBackTitleStyle: {
    fontFamily: 'merchant',
    fontSize: 24,
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  safeAreaInsets: { top: 44 }, // works fine with notch (without it header is flicking) maybe update to 5.x version will help
};

const StatsNavigator = createStackNavigator(
  {
    Stats: StatsScreen,
  },
  {
    defaultNavigationOptions,
  }
);

const ScanNavigator = createStackNavigator(
  {
    Verify: VerifyScreen,
    Classify: ClassifyScreen,
  },
  {
    defaultNavigationOptions,
  }
);

const HistoryNavigator = createStackNavigator(
  {
    History: HistoryScreen,
    ReceiptDetails: ReceiptDetailsScreen,
  },
  {
    defaultNavigationOptions,
  }
);

const tabsConfig = {
  Stats: {
    screen: StatsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => <Ionicons name='ios-stats' size={28} color={tabInfo.tintColor} />,
    },
  },
  Scan: {
    screen: ScanNavigator,
    navigationOptions: {
      // tabBarOnPress: takeImage,
      tabBarIcon: (tabInfo) => <Ionicons name='ios-qr-scanner' size={28} color={tabInfo.tintColor} />,

      // tabBarIcon: (tabInfo) => <Ionicons name='ios-aperture' size={28} />,
      // tabBarIcon: (tabInfo) => <Button onPress={takeImageHandler} />,
      // tabBarIcon: (tabInfo) => <Ionicons name='ios-paper' size={25} />,
      // tabBarIcon: (tabInfo) => <Ionicons name='ios-eye' size={25} />,
    },
  },
  History: {
    screen: HistoryNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => <Ionicons name='ios-paper' size={28} color={tabInfo.tintColor} />,

      // tabBarIcon: (tabInfo) => <Ionicons name='ios-book' size={25} />,
      // tabBarIcon: (tabInfo) => <Ionicons name='ios-list' size={25} />,
    },
  },
};

const AppBottomTabNavigator =
  Platform.OS === 'andriond'
    ? createMaterialBottomTabNavigator(tabsConfig, {
        activeColor: 'white',
        barStyle: {
          backgroundColor: Colors.primary,
        },
        labeled: false,
      })
    : createBottomTabNavigator(tabsConfig, {
        resetOnBlur: true,
        tabBarOptions: {
          activeTintColor: Colors.primary,
          showLabel: false,
        },
      });

export default createAppContainer(AppBottomTabNavigator);
