import * as React from 'react';
import { Text, View, Dimensions, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import MapView from 'react-native-maps';

import { Loading } from '../components/loading'
import { getItemValue } from '../utils/storage'

import { dicoStations } from '../utils/general'
import {
  getFavoriteStations, getAllDays, getRidesOfDay,
  lineRidesDay, HeatmapStations, old_home
} from '../utils/mapFunctions'

import { sleep } from '../utils/miscellaneous'
import { generalStyle } from '../style/generalStyle'
import {mapRidesStyle} from '../style/mapStyle'

const { width, height } = Dimensions.get("window");


const Paris = {
  latitude: 48.864716,
  longitude: 2.349014,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
}



export default class MapRidesView extends React.Component {

  state = {
    ridesInfos: undefined,
    stationsInfos: undefined,
    scrollLayer: 0,
    scrollDay: 0,
    seenDays: false,
    days: undefined,
    homes: undefined,
    favStations: undefined,
    coordonneesMap: {
      latitude: 48.864716,
      longitude: 2.349014,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    }
  };

  componentDidMount() {
    getItemValue("@rides_infos")
      .then((rides_infos) => {
        getItemValue("@stations_infos").then((stations_infos) => {
          let stationsInfos = JSON.parse(stations_infos);
          let ridesInfos = JSON.parse(rides_infos);
          let stations = dicoStations(stationsInfos);
          let rides = ridesInfos;

          let favStations = getFavoriteStations(rides);
          let days = getAllDays(rides);

          let homes = old_home(rides, stations);

          let layers = ["Heatmap"].concat(days);

          this.setState({
            homes: homes,
            days: days,
            favStations: favStations,
            stations: stations,
            rides: rides,
            layers: layers
          })
          sleep(1000)
            .then(() => this.setState({ seenDays: true }))
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state != nextState
  }

  componentDidUpdate() {
    let homes = this.state.homes;
    let days = this.state.days;
    let stations = this.state.stations;
    let rides = this.state.rides;

    let dayRidesArray = [];
    let currHome = [];


    if ((this.state.scrollLayer >= (width - 100)) && (this.state.scrollLayer % (width - 100) == 0)) {
      let currIndex = Math.trunc((this.state.scrollLayer) / (width - 100) + 1 / 2) - 1;

      let currDay = days[currIndex];
      let currDayRides = getRidesOfDay(rides, currDay);

      let currDayN = currDayRides.length;
      let maxLat, minLat, maxLon, minLon;
      for (let i = 0; i < currDayN; i++) {
        let idOrigin = currDayRides[i].stationStart;
        let idDest = currDayRides[i].stationEnd;

        let coordOrigin = stations[idOrigin];
        let coordDest = stations[idDest];

        if (i == 0) {
          maxLat = Math.max(coordOrigin[1], coordDest[1]);
          minLat = Math.min(coordOrigin[1], coordDest[1]);
          maxLon = Math.max(coordOrigin[2], coordDest[2]);
          minLon = Math.min(coordOrigin[2], coordDest[2]);
        } else {
          maxLat = Math.max(coordOrigin[1], maxLat);
          maxLat = Math.max(coordDest[1], maxLat);
          minLat = Math.min(coordOrigin[1], minLat);
          minLat = Math.min(coordDest[1], minLat);
          maxLon = Math.max(coordOrigin[2], maxLon);
          maxLon = Math.max(coordDest[2], maxLon);
          minLon = Math.min(coordOrigin[2], minLon);
          minLon = Math.min(coordDest[2], minLon);
        }
      }

      let coordonnees = {
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLon + minLon) / 2,
        latitudeDelta: maxLat - minLat + 0.01,
        longitudeDelta: maxLon - minLon + 0.01
      };
      this.mapview.animateToRegion(coordonnees);
    } else if (this.state.seenDays) {

      this.mapview.animateToRegion(Paris);

    }

  }

  getStationsPoints() {
    let stationsPoints = [];
    let favStations = this.state.favStations;
    let stations = this.state.stations;
    let totalFav = favStations.total;
    let n = totalFav.length;


    if ((this.state.scrollLayer < (width - 100))) {
      for (let i = 0; i < n; i++) {
        stationsPoints.push({
          latitude: stations[totalFav[i][1]][1],
          longitude: stations[totalFav[i][1]][2],
          weight: Math.min(totalFav[i][0], 50)
        })
      }
    }
    return stationsPoints;
  }

  getRidesOfDay() {
    let homes = this.state.homes;
    let days = this.state.days;
    let stations = this.state.stations;
    let rides = this.state.rides;

    let dayRidesArray = [];
    let currHome = [];


    if ((this.state.scrollLayer >= (width - 100)) && (this.state.scrollLayer % (width - 100) == 0)) {
      let currIndex = Math.trunc((this.state.scrollLayer) / (width - 100) + 1 / 2) - 1;

      // On affiche les maisons
      for (let i = 0; i < homes.length; i++) {
        let start = days.indexOf(homes[i].end);
        let end = days.indexOf(homes[i].start);
        if (currIndex >= start && currIndex <= end) {
          currHome.push(homes[i]);
        }
      }

      // On récupéres les trajets de ce jour là
      let currDay = days[currIndex];
      let currDayRides = getRidesOfDay(rides, currDay);

      let currDayN = currDayRides.length;
      for (let i = 0; i < currDayN; i++) {
        let idOrigin = currDayRides[i].stationStart;
        let idDest = currDayRides[i].stationEnd;

        let coordOrigin = stations[idOrigin];
        let coordDest = stations[idDest];

        if ((i > 0) && (coordDest != lastCoord)) {
          dayRidesArray.push({ "origin": coordDest, "dest": lastCoord, "isride": false, "idride": currDayRides[i].idRide });
        }
        let lastCoord = coordOrigin;
        dayRidesArray.push({ "origin": coordOrigin, "dest": coordDest, "isride": true, "idride": currDayRides[i].idRide });
      }
      for (let i = 0; i < dayRidesArray.length; i++) {
        dayRidesArray[i]['number'] = dayRidesArray.length - 1 - i;
      }
    }
    return { dayRidesArray: dayRidesArray, currHome: currHome }
  }

  render() {

    if (this.state.days == undefined) {
      return <Loading />
    }



    let homes = this.state.homes;
    let stationsPoints = this.getStationsPoints();
    let dayX = this.getRidesOfDay();
    let dayRidesArray = dayX.dayRidesArray;
    let currHome = dayX.currHome;


    return (
      <View style={generalStyle.container}>
        <StatusBar hidden={true} />
        <View style={generalStyle.topView}>
          <Text style={generalStyle.title}>Carte</Text>
        </View>
        <View style={mapRidesStyle.layerBloc}>
          <TouchableOpacity
            onPress={() => { this.scrollLayer.scrollTo({ x: this.state.scrollLayer - (width - 100) }) }}
            style={[mapRidesStyle.layerArrow, { paddingLeft: 20 }]}>
            {(this.state.scrollLayer > (width - 100) / 2) &&
              <Icon name='chevron-left'
                type='material-community'
                size={30} />
            }
          </TouchableOpacity>
          <ScrollView
            style={generalStyle.classic}
            snapToInterval={width - 100}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            ref={(node) => this.scrollLayer = node}
            onScroll={(e) => this.setState({ "scrollLayer": e.nativeEvent.contentOffset.x })}
            horizontal>
            {this.state.layers.map(text => (
              <View style={mapRidesStyle.oneLayer}>
                <Text style={mapRidesStyle.fontLayer}>
                  {text}
                </Text>
              </View>))
            }
          </ScrollView>
          <TouchableOpacity
            onPress={() => { this.scrollLayer.scrollTo({ x: this.state.scrollLayer + (width - 100) }) }}
            style={[mapRidesStyle.layerArrow, { paddingRight: 20 }]}>
            <Icon name='chevron-right'
              type='material-community'
              size={30} />
          </TouchableOpacity>
        </View>

        <MapView
          style={generalStyle.classic}
          initialRegion={Paris}
          ref={node => this.mapview = node}
        >
          {((this.state.scrollLayer > (1 / 2) * (width - 100))) &&
            dayRidesArray.map(r => lineRidesDay(r, currHome))
          }
          {(this.state.scrollLayer <= (width - 100) / 2) &&
            HeatmapStations(stationsPoints, homes)}
        </MapView>
      </View>
    )
  }
}