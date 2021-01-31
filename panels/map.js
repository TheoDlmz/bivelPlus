import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements'
import MapView from 'react-native-maps';

import {Loading} from './loading'
import {getItemValue} from '../api/storage'

import {dicoStations} from '../rides_functions/general'
import {getFavoriteStations, getAllDays, getRidesOfDay,
  lineRidesDay, HeatmapStations, old_home} from '../rides_functions/mapFunctions'

const { width, height } = Dimensions.get("window");


const itemLayer = (params) =>
{
  return (
      <View style={styles.oneLayer}>
        <Text style={styles.fontLayer}>
          {params.text}
        </Text>
      </View>
  )
}


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


export default class MapRidesView extends React.Component{

  state={
      ridesInfos:undefined,
      stationsInfos:undefined,
      scrollLayer:0,
      scrollDay:0,
      seenDays:false,
  };
  
  componentDidMount() {
      getItemValue("@rides_infos").then((res) => this.setState({ridesInfos:JSON.parse(res)}));   
      getItemValue("@stations_infos").then((res) => this.setState({stationsInfos:JSON.parse(res)}));
      sleep(1000).then(() => this.setState({seenDays:true}))
    }




  render() {

        if (this.state.ridesInfos == undefined || this.state.stationsInfos == undefined){
            return <Loading/>
        }

        
        let stations = dicoStations(this.state.stationsInfos);
        let rides = this.state.ridesInfos;

        let favStations = getFavoriteStations(rides);
        let days = getAllDays(rides);

        let homes = old_home(rides, stations);
        let totalFav = favStations.total;
        let n = totalFav.length;

        let stationsPoints = [];
        let dayRidesArray= [];
        let currHome = [];


        if ((this.state.scrollLayer >= (width-100)) &&(this.state.scrollLayer%(width-100) == 0)){
          let currIndex = Math.trunc((this.state.scrollLayer)/(width-100)+1/2)-1;
          (this.state.scrollLayer)
          for (let i =0; i < homes.length; i++){
            let start = days.indexOf(homes[i].end);
            let end = days.indexOf(homes[i].start);
            if (currIndex >= start && currIndex <= end){
              currHome.push(homes[i]);
            }
          }
          let currDay = days[currIndex];
          let currDayRides = getRidesOfDay(rides, currDay);

          let currDayN = currDayRides.length;
          let maxLat, minLat, maxLon, minLon;

          for (let i=0; i < currDayN; i++){
            let idOrigin = currDayRides[i].stationStart;
            let idDest = currDayRides[i].stationEnd;

            let coordOrigin = stations[idOrigin];
            let coordDest = stations[idDest];
            
            if ((i > 0) && (coordDest != lastCoord)){
              dayRidesArray.push({"origin":coordDest,"dest":lastCoord,"isride":false, "idride":currDayRides[i].idRide});
            }

            let lastCoord = coordOrigin;

            dayRidesArray.push({"origin":coordOrigin,"dest":coordDest,"isride":true, "idride":currDayRides[i].idRide});
            if (i == 0){
              maxLat = Math.max(coordOrigin[1], coordDest[1]);
              minLat = Math.min(coordOrigin[1], coordDest[1]);
              maxLon = Math.max(coordOrigin[2], coordDest[2]);
              minLon = Math.min(coordOrigin[2], coordDest[2]);
            }else{
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

          let coordonnees={
            latitude:(maxLat+minLat)/2,
            longitude:(maxLon+minLon)/2,
            latitudeDelta:maxLat-minLat+0.01,
            longitudeDelta:maxLon-minLon+0.01
          };
          this.mapview.animateToRegion(coordonnees);
        }else if(this.state.seenDays){
          let coordonnees = {
            latitude:48.864716,
            longitude:2.349014,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }
          this.mapview.animateToRegion(coordonnees);

        }

        for (let i = 0;i < dayRidesArray.length; i++){
          dayRidesArray[i]['number'] = dayRidesArray.length-1-i;
        }

        for (let i = 0;i < n; i++){
          stationsPoints.push({
            latitude:stations[totalFav[i][1]][1],
            longitude:stations[totalFav[i][1]][2],
            weight:Math.min(totalFav[i][0],50)
          })
        }

        let layers = ["Heatmap"].concat(days);

        return (
          <View style={styles.container}>
            
            <StatusBar hidden={true} />
            <View style={styles.topView}>
                    <Text style={styles.pseudo}>Carte</Text>
            </View>
            <View style={styles.layerBloc}>
              <TouchableOpacity
                onPress={() => {
                this.scrollLayer.scrollTo({x:this.state.scrollLayer - (width-100)})}}
                style={[styles.layerArrow,{paddingLeft:20}]}>
                {(this.state.scrollLayer > (width-100)/2) &&
                  <Icon name='chevron-left'
                    type='material-community'
                    size={30} />
                }
              </TouchableOpacity>
              <ScrollView
              style={styles.layerScroll}
              snapToInterval={width-100}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              ref={(node) => this.scrollLayer = node}
              onScroll={(e) => this.setState({"scrollLayer":e.nativeEvent.contentOffset.x})}
              horizontal>
                {layers.map(e => itemLayer({text:e}))}
              </ScrollView>
              <TouchableOpacity
              onPress={() => {this.scrollLayer.scrollTo({x:this.state.scrollLayer + (width-100)})}}
              style={[styles.layerArrow,{paddingRight:20}]}>
                <Icon name='chevron-right'
                  type='material-community'
                  size={30}/>
              </TouchableOpacity>
            </View>
          
            <MapView 
              style={{flex:1}} 
              initialRegion={{
                latitude:48.864716,
                longitude:2.349014,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
              }}
              ref={node => this.mapview = node}
            >
             
              {((this.state.scrollLayer > (1/2)*(width-100))) && 
              dayRidesArray.map(r => lineRidesDay(r, currHome))
              }
              {(this.state.scrollLayer <= (width-100)/2) && 
              HeatmapStations(stationsPoints, homes)}
            </MapView>
          </View>
        )
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"rgb(40, 62, 105)"
    },
  layerScroll:{
    flex:1,
  },
  layerBloc:{
    height:50,
    flexDirection:'row',
    backgroundColor:"#a3acd6"
  },
  layerArrow:{
    width:50,
    alignItems:"stretch",
    justifyContent:"center",
    paddingLeft:5,
    paddingRight:5
  },
  oneLayer:{
    width:width-100,
    alignItems:"center",
    justifyContent:"center"
  },
  fontLayer:{
    fontSize:26,

  },selectDate:{
    height:35,
    alignItems:"stretch",
    justifyContent:"center",
    backgroundColor:"#e5ebe1"
  }, dayScroll:{
    paddingLeft:width/2-55, 
    paddingRight:width/2-45,
  }, dayItem:{
    width:100,
    marginLeft:5,
    marginRight:5,
    justifyContent:"center",
    alignItems:"center"
  }, dayText:{
    fontSize:16
  },  topView:{
    padding:15,
    backgroundColor:"rgb(25, 41, 71)",
    justifyContent:"center",
    alignItems:"center",
    alignSelf:"stretch",
  },    
  pseudo:{
      fontSize:30,
      fontWeight:'700',
      color:"#d8deeb"
  
  },

});