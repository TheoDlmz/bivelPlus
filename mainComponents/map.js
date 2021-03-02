import * as React from 'react';
import { Animated, View, Text, Image, TouchableHighlight, StatusBar } from "react-native";
import { Icon } from 'react-native-elements'
import MapView, { Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';

import { fetchStations } from '../api/getStations'
import { getItemValue } from '../utils/storage'
import { addZero, popupMessage, sleep } from '../utils/miscellaneous'
import { parisCoord, MarkerStation } from '../components/mapsComponents'
import { closest_station } from '../utils/mapFunctions'

import { mapStyle } from '../style/mapStyle'
import { generalStyle } from '../style/generalStyle'
import { TouchableOpacity } from 'react-native';

import { StationChart } from '../components/chartsComponents'
import { dicoStations } from '../utils/general';
import { Linking } from 'react-native';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

let customFonts = {
  'MontserratRegular': require('../fonts/Montserrat-Regular.ttf'),
};


const heatmapLimit = 0.04;

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
    delta: false,
    clic_id: -1,
    last_update: undefined,
    userInfos: undefined,

    version: "",
    decal: new Animated.Value(0),
    type: 0,
    expend: false,
    expend_size: new Animated.Value(0),

    show_closest: true,
    show_infos: true,
    news: undefined
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    let infos = require('../app.json');
    this.setState({ version: infos.expo.version });
    this.loadData(true);

    getItemValue("@user_infos")
      .then((res) => this.setState({ userInfos: JSON.parse(res) }))
      .catch(() => { });



  }


  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.delta ||
      this.state.stations != nextState.stations ||
      this.state.type != nextState.type ||
      this.state.delta != nextState.delta ||
      this.state.clic_id != nextState.clic_id ||
      this.state.expend != nextState.expend ||
      this.show_infos != nextState.show_infos);
  }
  // Desactive la mise à jour automatique de la carte lorsque l'on quitte l'application
  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  goToInitialRegion = async () => {
    Location.getPermissionsAsync().then(() =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let userPos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          this.setState({
            userPos: userPos
          });
          this.mapview.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          });
          this.showClosest();

        },
        (error) => { console.log(error); },
        { enableHighAccuracy: true, timeout: 30000 }
      )).catch();

  }




  // Recupere les stations
  loadData(first) {
    fetchStations()
      .then((res) => {
        this.setState({ stations: res.data, last_update: new Date(), news:res.news });
        if (first) {
          this.showClosest();
        }
      })
      .catch((err) => popupMessage("error", "Données non accessibles", err.message));
    this.intervalID = setTimeout(this.loadData.bind(this, false), 60000);
  }


  showClosest() {
    let show = this.state.show_closest;
    if (show) {
      getItemValue("@stations_infos")
        .then((stations_infos) => {
          let stations = dicoStations(JSON.parse(stations_infos));
          let closest = closest_station(this.state.userPos, stations);
          let id_bivel;
          for (let i = 0; i < this.state.stations.length; i++) {
            if (this.state.stations[i].id_station == closest.id) {
              id_bivel = this.state.stations[i].id_bivel;
              break
            }
          }
          this.setState({ clic_id: id_bivel });
        })
        .catch();
    } else {
      this.setState({ show_closest: true })
    }

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
      if (this.state.type == 0) {
        weight = Math.min(50, this.state.stations[i].ebike + this.state.stations[i].meca);
      } else if (this.state.type == 1) {
        weight = Math.min(50, this.state.stations[i].capacity -
          (this.state.stations[i].ebike + this.state.stations[i].meca));

        colors = [
          "rgba(153, 149, 201,0)",
          "rgba(76, 67, 181,0.7)",
          "rgba(76, 67, 181,0.8)",
          "rgba(76, 67, 181,0.9)",
          "rgba(35, 27, 130,1)"];
      } else if (this.state.type == 2) {
        weight = this.state.stations[i].activity * 10;

        colors = [
          "rgba(237, 174, 97,0)",
          "rgba(199, 90, 36,0.7)",
          "rgba(199, 90, 36,0.8)",
          "rgba(199, 90, 36,0.9)",
          "rgba(235, 226, 54,1)"];

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

    let radius = 20;
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
    if (!inScreen) {
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
      delta: center.longitudeDelta <= heatmapLimit
    });
  }

  moveBall(x) {
    Animated.spring(this.state.decal, {
      toValue: x,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    this.setState({ type: x });
  }

  expendBottom(tgt) {
    Animated.spring(this.state.expend_size, {
      toValue: tgt,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    this.setState({ expend: (tgt == 1) });



  }

  render() {

    if (!this.state.fontsLoaded){

      return <AppLoading/>
    }
    var today = this.state.last_update;
    let today_str = "Loading...";
    let date_str = "";
    if (today != undefined) {
      date_str = addZero(today.getHours()) + ':' + addZero(today.getMinutes());
      today_str = "Mis à jour à " + date_str;
    }

    let x = this.state.decal.interpolate({ inputRange: [0, 2], outputRange: [3, 123] })
    let height_bottom = this.state.expend_size.interpolate({ inputRange: [0, 1], outputRange: [0, 200] })
    return (
      <View style={generalStyle.classic}>
        <StatusBar hidden={true} />
        <MapView
          showsUserLocation={true}
          provider={"google"}
          style={generalStyle.classic}
          followUserLocation={true}
          initialRegion={parisCoord}
          onPress={() => { this.setState({ clic_id: -1 }); this.expendBottom(0) }}
          onMapReady={this.goToInitialRegion.bind(this)}
          onRegionChangeComplete={(center) => { this.updateRegion(center) }}
          ref={node => this.mapview = node}
        >
          {this.state.delta &&
            this.state.stations.map((station) => {
              if (this.isInScreen(station)) {
                return <MarkerStation
                  station={station}
                  type={this.state.type}
                  onPress={() => this.setState({ 'clic_id': station.id_bivel })}
                  key={`${date_str}.${station.id_bivel}`}
                />
              }
            })
          }
          {!this.state.delta &&
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
            <Text style={{ color: "white", fontFamily: 'MontserratRegular'  }}>
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
                Beta
              </Text>
            }
          </View>
        </View>
        <View style={mapStyle.select}>
          <Animated.View style={[mapStyle.animatedBlob, { left: x }]} />
          <TouchableOpacity style={{ padding: 10, marginRight: 5 }}
            onPress={() => this.moveBall(0)}>
            <Icon
              name='bike'
              type='material-community'
              color="#ddd"
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, marginHorizontal: 5 }}
            onPress={() => this.moveBall(1)}>
            <Icon
              name='parking'
              type='material-community'
              color="#ddd"
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, marginLeft: 5 }}
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
          <View style={mapStyle.bottomView}>
            <View style={mapStyle.bottomViewInfos}>
              <Text style={[{ flex: 8, }, mapStyle.stationName, ]}>
                {this.state.stations[this.state.clic_id].name}
              </Text>
              
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.expendBottom(!this.state.expend)}>

                <Icon
                  name={this.state.expend ? 'minus' : 'plus'}
                  type='material-community'
                  color="#eee"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap",justifyContent:"center" }}>
              <View style={mapStyle.bottomTextBulle}>
                <Text style={mapStyle.bottomTextValue}>
                  {this.state.stations[this.state.clic_id].meca}
                </Text>
                <Text style={mapStyle.bottomTextDescVelo}>Mécaniques</Text>
              </View>
              <View style={mapStyle.bottomTextBulle}>
                <Text style={mapStyle.bottomTextValue}>
                  {this.state.stations[this.state.clic_id].ebike}
                </Text>
                <Text style={mapStyle.bottomTextDescVelo}>Électriques</Text>
              </View>
              <View style={mapStyle.bottomTextBulle}>

                {(this.state.stations[this.state.clic_id].last_arrival < 60) &&
                  <Text style={mapStyle.bottomTextValue}>
                    {Math.round(this.state.stations[this.state.clic_id].last_arrival)}
                    <Text style={{ fontSize: 12 }}> min</Text>
                  </Text>
                }
                {(this.state.stations[this.state.clic_id].last_arrival >= 60 &&
                  this.state.stations[this.state.clic_id].last_arrival < 24 * 60) &&
                  <Text style={mapStyle.bottomTextValue}>
                    {Math.round(this.state.stations[this.state.clic_id].last_arrival / 60)}
                    <Text style={{ fontSize: 12 }}> h</Text>
                  </Text>
                }
                {(this.state.stations[this.state.clic_id].last_arrival >= 24 * 60) &&
                  <Text style={mapStyle.bottomTextValue}>
                    {Math.round(this.state.stations[this.state.clic_id].last_arrival / (60 * 24))}
                    <Text style={{ fontSize: 12 }}> j</Text>
                  </Text>
                }
                <Text style={mapStyle.bottomTextDescVelo}>Dernier</Text>
              </View>
              <View style={mapStyle.bottomTextBulle}>
                <Text style={mapStyle.bottomTextValue}>
                  {this.state.stations[this.state.clic_id].place}
                </Text>
                <Text style={mapStyle.bottomTextDescVelo}>Places</Text>
              </View>

              <View style={mapStyle.bottomTextBulle}>
                <Text style={mapStyle.bottomTextValue}>
                  {this.state.stations[this.state.clic_id].broken}
                </Text>
                <Text style={mapStyle.bottomTextDescVelo}>Cassés</Text>
              </View>

              <View style={mapStyle.bottomTextBulle}>
                {this.state.stations[this.state.clic_id].activity > 0 ?
                  (<Text style={mapStyle.bottomTextValue}>
                    {Math.round(60 / this.state.stations[this.state.clic_id].activity)}
                    <Text style={{ fontSize: 12 }}> min</Text>
                  </Text>) :
                  (<Text style={mapStyle.bottomTextValue}>
                    {">1"}
                    <Text style={{ fontSize: 12 }}> h</Text>
                  </Text>)}

                <Text style={mapStyle.bottomTextDescVelo}>Attente</Text>
              </View>

            </View>
            <Animated.View style={{ height: height_bottom }}>
              {this.state.expend &&
                <StationChart
                  station={this.state.stations[this.state.clic_id]}
                  key={`stationChart_${this.state.clic_id}`} />
              }
            </Animated.View>
          </View>

        }
        {(this.state.show_infos && this.state.news != undefined)  &&
          <View style={{ position: "absolute", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <View style={{ padding: 10, backgroundColor: "#224275", width: "80%", height: "60%", alignItems: "center" }}>
              <TouchableOpacity
                style={{ width: "100%", height: "90%" }}
                onPress={() => {if(this.state.news.url != ""){Linking.openURL(this.state.news.url)}}}>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{
                  uri: 'http://theo.delemazure.fr/bivelAPI/infos/'+this.state.news.img,
                }}
              />
              </TouchableOpacity>
              <TouchableHighlight
                style={{ width: "100%", height: "10%", backgroundColor: "rgb(179, 64, 90)", alignItems: "center", justifyContent: "center" }}
                underlayColor={"#540a08"}
                onPress={() => { this.setState({ show_infos: false }) }}>
                <Text style={{ color: "#eee", fontWeight: "bold", fontSize: 22 }}>
                  Fermer
                </Text>
              </TouchableHighlight>
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


