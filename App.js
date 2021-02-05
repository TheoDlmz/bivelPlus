
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from './mainComponents/map'
import SignalScreen from './mainComponents/report'
import QRScreen from './mainComponents/qrReader'
import AccountView from './mainComponents/profile'
import StatsView from './userComponents/statistiques'
import MapRidesView from './userComponents/mapRides'
import RidesView from './userComponents/rides'
import BadgesView from './userComponents/badges'
import RankingView from './userComponents/ranking'
import UserReportsView from './userComponents/reports'
import Toast from 'react-native-toast-message';


const options = {
  headerShown: false,
  header: {
    visible: false
  }
}
const Stack = createStackNavigator();
export default  function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Account">
     
        <Stack.Screen   name="Account" component={AccountView}   options={options}/>
        <Stack.Screen   name="QR" component={QRScreen} options={options}/>
        <Stack.Screen   name="Map" component={MapScreen} options={options}/>
        <Stack.Screen   name="Report" component={SignalScreen} options={options}/>
        
        <Stack.Screen   name="Stats" component={StatsView} options={options}/>
        <Stack.Screen   name="MapRides" component={MapRidesView} options={options}/>
        <Stack.Screen   name="Rides" component={RidesView} options={options}/>
        <Stack.Screen   name="Badges" component={BadgesView} options={options}/>
        <Stack.Screen   name="Ranking" component={RankingView} options={options}/>
        <Stack.Screen   name="UserReports" component={UserReportsView} options={options}/>

      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
    
  );
};
