import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Platform } from 'react-native';

import HistoryScreen from '../screens/history/HistoryScreen';
import ReceiptDetailsScreen from '../screens/history/ReceiptDetailsScreen';
import Colors from '../constants/Colors';

const HistoryNavigator = createStackNavigator(
  {
    History: HistoryScreen,
    ReceiptDetails: ReceiptDetailsScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
      },
      headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    },
  }
);

export default createAppContainer(HistoryNavigator);
