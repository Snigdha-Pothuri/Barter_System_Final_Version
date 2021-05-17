import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SignUpLogin from './screens/SignupLoginScreen';
import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSideBarMenu from './components/CustomSideBarMenu';
import SettingScreen from './screens/SettingScreen';
import {AppDrawerNavigator} from "./components/AppDrawerNavigator" 
import {AppTabNavigator} from "./components/AppTabNavigator" 
import {createAppContainer,createSwitchNavigator} from "react-navigation"

export default function App() { 
  return ( 
  <AppContainer/> 
  ); 
} 
const switchNavigator = createSwitchNavigator({
   SignUpLogin:{screen: SignUpLogin},
   Drawer:{screen: AppDrawerNavigator},
   BottomTab: {screen: AppTabNavigator}, 
  }) 
const AppContainer=createAppContainer(switchNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
