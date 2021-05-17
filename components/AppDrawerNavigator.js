import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyBarters from '../screens/MyBarters';

const AppDrawerNavigator = createDrawerNavigator ({
    Home:{ 
      screen:AppTabNavigator
    },
    Settings : {
      screen : SettingScreen
    }},
    
    {
     contentComponent : CustomSideBarMenu
   },
   {
   
   initialRouteName : "Home"
   
   })

