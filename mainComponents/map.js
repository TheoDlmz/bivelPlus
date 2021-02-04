import * as React from 'react';
import { View, Text, Image, TouchableHighlight, StatusBar } from "react-native";
import { Icon } from 'react-native-elements'
import MapView, { Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';

import { fetchStations } from '../api/getStations'
import { getItemValue } from '../utils/storage'
import { addZero, popupMessage } from '../utils/miscellaneous'
import { parisCoord, MarkerStation } from '../components/mapsComponents'

import {mapStyle} from '../style/mapStyle'
import {generalStyle} from '../style/generalStyle'


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
    for (let i = 0; i < this.state.stations.length; i++) {
      stationsPoints.push({
        latitude: this.state.stations[i].geo[0],
        longitude: this.state.stations[i].geo[1],
        weight: Math.min(50, this.state.stations[i].ebike + this.state.stations[i].meca)
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
          colors: [
            "rgba(207, 71, 37,0)",
            "rgba(10, 163, 12,0.7)",
            "rgba(10, 163, 12,0.8)",
            "rgba(10, 163, 12,0.9)",
            "rgba(27, 99, 28,1)"],
          startPoints: [0, 0.3, 0.5, 0.7, 1]
        }}
      />)
  }

  // Teste si on doit afficher une station ou non
  isInScreen(station) {
    let lat = station.geo[0];
    let lon = station.geo[1];
    return (
      (lat >= this.state.southwest.latitude) &&
      (lat <= this.state.northeast.latitude) &&
      (lon >= this.state.southwest.longitude) &&
      (lon <= this.state.northeast.longitude))
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



  render() {

    var today = this.state.last_update;
    let today_str = "Loading...";
    if (today != undefined) {
      today_str = "last update : " + addZero(today.getHours()) + ':' + addZero(today.getMinutes());

    }

    const heatmapLimit = 0.05;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <MapView
          showsUserLocation={true}
          style={{ flex: 1 }}
          initialRegion={parisCoord}
          onPress={() => this.setState({ clic_id: -1 })}
          onRegionChangeComplete={(center) => { this.updateRegion(center) }}
          ref={node => this.mapview = node}
        >
          {this.state.delta <= heatmapLimit &&
            this.state.stations.map((station) =>
            {
            if (this.isInScreen(station)) {
              return <MarkerStation
                station={station}
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
        <Text style={mapStyle.versionText}>
          {"V" + this.state.version}
        </Text>
      </View>
    )
  }
}


