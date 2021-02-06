import * as React from 'react';
import { Animated, View, Text, Image, TouchableHighlight, StatusBar } from "react-native";
import { colors, Icon } from 'react-native-elements'
import MapView, { Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';

import { fetchStations } from '../api/getStations'
import { getItemValue } from '../utils/storage'
import { addZero, popupMessage } from '../utils/miscellaneous'
import { parisCoord, MarkerStation } from '../components/mapsComponents'

import { mapStyle } from '../style/mapStyle'
import { generalStyle } from '../style/generalStyle'
import { velibAPI } from '../api/api_adresses';
import { TouchableOpacity } from 'react-native';


export default class HomeScreen extends React.Component {

  state = {
    stations: [],
    northeast: {
      latitude: 48.864716 + 0.15 / 2,
      longitude: 2.349014 + 0.15 / 2,
    },
    southwest: {
      latitude: 48.864716 - 0.15 / 2,
      longitude: 2.349014 - 0.15 / 2,
    },
    delta: 0.02,
    clic_id: -1,
    last_update: undefined,
    userInfos: undefined,
    version: "",
    decal: new Animated.Value(0),
    type:0
  };


  componentDidMount() {
    this.loadData();
    Location.requestPermissionsAsync();
    //Location.getCurrentPositionAsync({});    
    getItemValue("@user_infos")
      .then((res) => this.setState({ userInfos: JSON.parse(res) }))
      .catch();
    let infos = require('../app.json');
    this.setState({ version: infos.expo.version });
  }


  shouldComponentUpdate(nextProps, nextState){
    return this.state != nextState
  }
  // Desactive la mise à jour automatique de la carte lorsque l'on quitte l'application
  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  // Recupere les stations
  loadData() {
    fetchStations()
      .then((res) => { this.setState({ stations: res.data, last_update: new Date() }) })
      .catch((err) => popupMessage("error", "Données non accessibles", err.message));
    this.intervalID = setTimeout(this.loadData.bind(this), 60000);
  }


  // Je le laisse ici car de toute façon j'aimerai changer la heatmap
  printHeatmap() {
    let stationsPoints = [];
    let colors;
    for (let i = 0; i < this.state.stations.length; i++) {
      let weight = 0;
      colors = [
        "rgba(207, 71, 37,0)",
        "rgba(10, 163, 12,0.7)",
        "rgba(10, 163, 12,0.8)",
        "rgba(10, 163, 12,0.9)",
        "rgba(27, 99, 28,1)"];
      if (this.state.type == 0){
        weight =Math.min(50, this.state.stations[i].ebike + this.state.stations[i].meca);
      }else if (this.state.type == 1){
        weight =  Math.min(50, this.state.stations[i].capacity - 
          (this.state.stations[i].ebike + this.state.stations[i].meca));
          
        colors = [
          "rgba(153, 149, 201,0)",
          "rgba(76, 67, 181,0.7)",
          "rgba(76, 67, 181,0.8)",
          "rgba(76, 67, 181,0.9)",
          "rgba(35, 27, 130,1)"];
      }
      stationsPoints.push({
        latitude: this.state.stations[i].geo[0],
        longitude: this.state.stations[i].geo[1],
        weight: weight
      })
    }

    if (stationsPoints.length == 0) {
      return
    }

    let radius = 20 * 0.2 / this.state.delta;
    radius = Math.min(50, radius);
    radius = Math.max(10, radius);
    return (
      <Heatmap
        points={stationsPoints}
        radius={radius}
        gradient={{
          colors: colors,
          startPoints: [0, 0.3, 0.5, 0.7, 1]
        }}
      />)
  }

  // Teste si on doit afficher une station ou non
  isInScreen(station) {
    let lat = station.geo[0];
    let lon = station.geo[1];
    let inScreen = (
      (lat >= this.state.southwest.latitude) &&
      (lat <= this.state.northeast.latitude) &&
      (lon >= this.state.southwest.longitude) &&
      (lon <= this.state.northeast.longitude))
    if (!inScreen){
      return false;
    }
    return true
  }

  // Mets à jour les différentes variables d'états
  updateRegion(center) {
    this.setState({
      northeast: {
        latitude: center.latitude + center.latitudeDelta / 2,
        longitude: center.longitude + center.longitudeDelta / 2,
      }, southwest: {
        latitude: center.latitude - center.latitudeDelta / 2,
        longitude: center.longitude - center.longitudeDelta / 2,
      },
      delta: center.longitudeDelta
    });
  }

  moveBall(x){
    Animated.spring(this.state.decal, {
      toValue: x,
      duration:500,
      useNativeDriver: false, 
    }).start();
    this.setState({type:x});
  }

  render() {

    var today = this.state.last_update;
    let today_str = "Loading...";
    if (today != undefined) {
      today_str = "last update : " + addZero(today.getHours()) + ':' + addZero(today.getMinutes());

    }

    let x = this.state.decal.interpolate({inputRange:[0,2], outputRange:[3,123]})
    const heatmapLimit = 0.04;
    return (
      <View style={generalStyle.classic}>
        <StatusBar hidden={true} />
        <MapView
          showsUserLocation={true}
          provider={"google"}
          style={generalStyle.classic}
          initialRegion={parisCoord}
          onPress={() => this.setState({ clic_id: -1 })}
          onRegionChangeComplete={(center) => { this.updateRegion(center) }}
          ref={node => this.mapview = node}
        >
          {this.state.delta <= heatmapLimit &&
            this.state.stations.map((station) => {
              if (this.isInScreen(station)) {
                return <MarkerStation
                  station={station}
                  type={this.state.type}
                  onPress={() => this.setState({ 'clic_id': station.id_bivel })}
                />
              }
            })
          }
          {this.state.delta > heatmapLimit &&
            this.printHeatmap()
          }
        </MapView>
        <View style={mapStyle.topView}>
          <View style={generalStyle.sideTopView}>
            <TouchableHighlight
              underlayColor=""
              onPress={() => this.props.navigation.navigate('QR')} >
              <Icon
                name='alert-circle'
                type='material-community'
                color="rgb(230, 221, 62)"
                size={42}
              />
            </TouchableHighlight>
            <Text style={mapStyle.signalerText}>
              Signaler
            </Text>
          </View>
          <View style={generalStyle.center}>
            <Image
              style={{ height: 40, width: 180 }}
              source={require('../assets/logo.png')}
            />
            <Text style={{ color: "white" }}>
              {today_str}
            </Text>
          </View>
          <View style={generalStyle.sideTopView}>
            <TouchableHighlight
              underlayColor=""
              onPress={() => this.props.navigation.navigate('Account')}
            >
              <Icon
                name='account'
                type='material-community'
                color="#ddd"
                size={50}
              />
            </TouchableHighlight>
            {this.state.userInfos &&
              <Text style={mapStyle.pseudoText}>
                {this.state.userInfos['generalDetails']['customerDetails']['name']['firstName']}
              </Text>
            }
            {this.state.userInfos == undefined &&
              <Text style={mapStyle.pseudoText}>
                Login
              </Text>
            }
          </View>
        </View>
        <View style={mapStyle.select}>
          <Animated.View style={[mapStyle.animatedBlob,{left:x}]}/>
          <TouchableOpacity style={{padding:10, marginRight:5}}
          onPress={() => this.moveBall(0)}>
          <Icon
            name='bike'
            type='material-community'
            color="#ddd"
            size={30}
          />
          </TouchableOpacity>
          <TouchableOpacity style={{padding:10, marginHorizontal:5}}
          onPress={() => this.moveBall(1)}>
          <Icon
            name='parking'
            type='material-community'
            color="#ddd"
            size={30}
          />
          </TouchableOpacity>
          <TouchableOpacity style={{padding:10, marginLeft:5}}
          onPress={() => this.moveBall(2)}>
          <Icon
            name='timer-sand-full'
            type='material-community'
            color="#ddd"
            size={30}
          />
          </TouchableOpacity>

        </View>
        {this.state.clic_id >= 0 &&
        <View style={{
          position:"absolute",
          width:"90%",
          alignSelf:"center",
          backgroundColor:"rgb(25, 41, 71)",
          borderRadius:2,
          bottom:10,
          padding:10}}>
            <Text style={{color:"white",fontWeight:"700",fontSize:18}}>
              {this.state.stations[this.state.clic_id].name}
            </Text>
            <View style={{flexDirection:"row"}}>
            <View style={{margin:5, alignItems:"center"}}>
            <Text style={{color:"white",fontWeight:"800",fontSize:22}}>{this.state.stations[this.state.clic_id].meca}</Text>
            <Text style={{color:"#ddd"}}>mecas</Text>
            </View>
            <View style={{margin:5, alignItems:"center"}}>
            <Text style={{color:"white",fontWeight:"800",fontSize:22}}>{this.state.stations[this.state.clic_id].ebike}</Text>
            <Text style={{color:"#ddd"}}>elecs</Text>
            </View>
            <View style={{margin:5, alignItems:"center"}}>
            <Text style={{color:"white",fontWeight:"800",fontSize:22}}>{this.state.stations[this.state.clic_id].place}</Text>
            <Text style={{color:"#ddd"}}>places</Text>
            </View>
            </View>
          </View>
        
        }
        <Text style={mapStyle.versionText}>
          {"V" + this.state.version}
        </Text>
      </View>
    )
  }
}


