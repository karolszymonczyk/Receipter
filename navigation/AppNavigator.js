import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import HistoryScreen from '../screens/history/HistoryScreen';
import ReceiptDetailsScreen from '../screens/history/ReceiptDetailsScreen';
import VerifyScreen from '../screens/scan/VerifyScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import takeImage from '../screens/scan/takePhoto';
import Colors from '../constants/Colors';
import AuthScreen from '../screens/auth/AuthScreen';
import StartScreen from '../screens/StartScreen';

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
  safeAreaInsets: { top: 44 }, // works fine with notch (without it header is flicking)
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
      tabBarOnPress: takeImage,
      tabBarIcon: (tabInfo) => <Ionicons name='ios-qr-scanner' size={28} color={tabInfo.tintColor} />,
    },
  },
  History: {
    screen: HistoryNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => <Ionicons name='ios-paper' size={28} color={tabInfo.tintColor} />,
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

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Start: StartScreen,
  Auth: AuthNavigator,
  App: AppBottomTabNavigator,
});

export default createAppContainer(MainNavigator);
