
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from './map'
import SignalScreen from './report'
import QRScreen from './qr_reader'
import AccountView from './profile'
import StatsView from './panels/statistiques'
import MapRidesView from './panels/map'
import RidesView from './panels/trajets'
import BadgesView from './panels/badges'
import RankingView from './panels/ranking'
import UserReportsView from './panels/reports'
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
      initialRouteName="Map">
     
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
