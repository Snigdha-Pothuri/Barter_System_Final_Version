import {createStackNavigator} from 'react-navigation-stack';
import ExchangeScreen from "../screens/ExchangeScreen";
import HomeScreen from '../screens/HomeScreen';

export const AppStackNavigator = createStackNavigator({
    Exchange : {
        screen : ExchangeScreen,
        navigationOptions:{
            headerShown : false
        }
    },
     Home : {
      screen : HomeScreen,
      navigationOptions:{
        headerShown : false
      }
  }
}, 


{

initialRouteName : "Exchange"

})