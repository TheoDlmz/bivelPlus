import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableHighlight, StatusBar } from "react-native";
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-elements'
import MapView, {Heatmap, Marker}  from 'react-native-maps';
import * as Location from 'expo-location';

import {fetchStations} from './api/getStations'
import {getItemValue} from './api/storage'

const interpolate = require('color-interpolate');

const { width, height } = Dimensions.get("window");


function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


export default class HomeScreen extends React.Component{

    state={
        stations:[],
        northeast:{
          latitude: 48.864716 + 0.15/ 2,
          longitude: 2.349014 +0.15/ 2,
        },
        southwest:{
          latitude: 48.864716 - 0.15 / 2,
          longitude: 2.349014 - 0.15/ 2,
        },
        delta:0.02,
        clic_id:-1,
        user_pos:undefined,
        last_update:undefined,
        userInfos:undefined,
        version:"",
    };
    loadData () {
      fetchStations().then((res) => {this.setState({stations:res.data, last_update:new Date()})}
              ).catch((err) => Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Failed to fetch stations',
          text2: err.message,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40
        }));
      this.intervalID = setTimeout(this.loadData.bind(this), 60000);
    }
    printHeatmap(){
        let stationsPoints = [];
        for (let i =0;i < this.state.stations.length;i++){
            stationsPoints.push({
                latitude:this.state.stations[i].geo[0],
                longitude:this.state.stations[i].geo[1],
                weight:Math.min(50,this.state.stations[i].ebike + this.state.stations[i].meca)
            })
        }
        
        if (stationsPoints.length == 0){
            return
        }

        let radius = 20*0.2/this.state.delta;
        radius = Math.min(50,radius);
        radius = Math.max(10,radius);
        return (<Heatmap
        points={stationsPoints}
        radius={radius}
        gradient={{
        colors:["rgba(207, 71, 37,0)",
                "rgba(10, 163, 12,0.7)",
                "rgba(10, 163, 12,0.8)",
                "rgba(10, 163, 12,0.9)",
                "rgba(27, 99, 28,1)"],
        startPoints:[0,0.3,0.5,0.7,1]
        }}
        />)





    }
    printMarker(e){

        let lat = e.geo[0];
        let lon = e.geo[1];
        if (
        (lat < this.state.southwest.latitude ) || 
        (lat > this.state.northeast.latitude) || 
        (lon < this.state.southwest.longitude) || 
        (lon > this.state.northeast.longitude)){
            return;
        }

        let colormap = interpolate(['red', 'orange', 'green']);
        let w = Math.min(1,(e.ebike + e.meca)/20)
        let color = colormap(w);
        return (<Marker
                coordinate={{
                    latitude:lat,
                    longitude:lon,
                }}
                key={e.id_bivel}
                tracksViewChanges={false}
                anchor={{x: .5, y: .5}}
                onPress={() => this.setState({'clic_id':e.id_bivel})}
                >
                <View
                    style={[styles.markerView,{backgroundColor:color}]}
                ><Text style={{color:"white"}}>{e.meca + '|' + e.ebike}</Text></View>
            </Marker>)
    }
    
    componentDidMount() {
        this.loadData();

          Location.requestPermissionsAsync();
          Location.getCurrentPositionAsync({}).then(
            (location) => this.setState({user_pos:{
              latitude:location.coords.latitude,
              longitude:location.coords.longitude}}));
              
        getItemValue("@user_infos").then((res) => this.setState({userInfos:JSON.parse(res)}));   
        
        let infos  = require('./app.json');
        this.setState({version:infos.expo.version});
    }
    componentWillUnmount() {
      clearTimeout(this.intervalID);
    }

    render() {

          var today = this.state.last_update;
          let today_str = "Loading...";
          if (today != undefined){
            today_str = "last update : "+addZero(today.getHours()) + ':' + addZero(today.getMinutes());
          
          }

         const heatmapLimit = 0.05;
          return (
            <View style={{flex:1}}>
            <StatusBar hidden={true} />
            
              <MapView 
              showsUserLocation={true}
                style={{flex:1}} 
                initialRegion={{
                  latitude:48.864716,
                  longitude:2.349014,
                  latitudeDelta: 0.15,
                  longitudeDelta: 0.15,
                }}
                onPress={() => this.setState({clic_id:-1})}
                onRegionChangeComplete={(center) => {
                    this.setState({northeast:{
                        latitude: center.latitude + center.latitudeDelta / 2,
                        longitude: center.longitude + center.longitudeDelta / 2,
                      }, southwest:{
                        latitude: center.latitude - center.latitudeDelta / 2,
                        longitude: center.longitude - center.longitudeDelta / 2,
                      },
                      delta : center.longitudeDelta})}}

                ref={node => this.mapview = node}
              >
               {this.state.delta <= heatmapLimit && this.state.stations.map(e => this.printMarker(e) )}
               {this.state.delta > heatmapLimit && this.printHeatmap() }
              </MapView>
              <View
              style={styles.topView}>
              <View
              style={styles.topLeft}>
                <TouchableHighlight
                underlayColor=""
                  onPress={() =>
                    this.props.navigation.navigate ('QR')} >
                <Icon name='alert-circle' 
                        type='material-community'
                        color="rgb(230, 221, 62)" 
                        size={42}  />
                  
                  </TouchableHighlight>
                  <Text
                  style={styles.signaler}>
                  Signaler
                </Text>
                </View>
                <View
                style={styles.middleTop}>
                  <Image
                  style={{height:40,width:180}}
                  source={require('./assets/logo.png')}
                  />
                  <Text style={{color:"white"}}>{today_str}</Text>
                </View>
                <View
                style={styles.rightTop}>
                  <TouchableHighlight
                underlayColor=""
                  onPress={() =>
                    this.props.navigation.navigate ('Account')} >
                <Icon name='account' 
                        type='material-community'
                        color="#ddd" 
                        size={50}  />
                  </TouchableHighlight>
                        
                {this.state.userInfos != undefined &&
                <Text
                  style={styles.pseudo}>
                  {this.state.userInfos['generalDetails']['customerDetails']['name']['firstName']}
                </Text>}
                {this.state.userInfos == undefined &&
                <Text
                  style={styles.pseudo}>
                  Login
                </Text>}
                </View>
                


              </View>
                <Text style={{position:'absolute', bottom:0, right:0}}>
                    {"V"+this.state.version}
                </Text>
            </View>
          )
    }
  }
  
  
  const styles = StyleSheet.create({
    markerView:
    {   width:40,
        height:40,
        borderRadius:40,
    justifyContent:"center",
    alignItems:"center"},
    topView:{
        position:"absolute",
        height:80,
        top:0,
        flexDirection:'row',
        width:width, 
        backgroundColor:"rgb(25, 41, 71)",
        borderBottomWidth:0,
        paddingRight:5,
        paddingLeft:5,
        borderBottomColor:"rgba(0,0,0,0.5)",
    justifyContent:"space-between"},
    middleTop:{
      alignItems:"center",
      justifyContent:"center"
    },
    rightTop:{
      width:60,
      alignItems:"center",
      justifyContent:"center"

    },
    pseudo:{
      marginTop:-8,
      fontWeight:"bold",
      color:'#ddd'
    },
    signaler:{
      marginTop:-4,
      fontWeight:"bold",
      color:'rgb(230, 221, 62)'
    },
    topLeft:{
    width:60,
    alignItems:"center",
    justifyContent:"center"
  }});