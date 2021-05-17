import HomeScreen from '../screens/HomeScreen';
import ExchangeScreen from '../screens/ExchangeScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {AppStackNavigator} from './AppStackNavigator' 
export const AppTabNavigator = createBottomTabNavigator({
 HomeScreen : {
      screen : AppStackNavigator,
  },
ExchangeScreen : {
      screen : ExchangeScreen,
  }
})      