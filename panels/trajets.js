import * as React from 'react';
import { Text, View, StyleSheet, FlatList,TouchableOpacity, StatusBar, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements'
import MapView from 'react-native-maps';

import {Loading} from './loading'
import {getItemValue} from '../api/storage'
import {AnimatedPolyline} from '../component/map_comp'

import {dicoStations} from '../rides_functions/general'
import {trajet} from '../rides_functions/mapFunctions'

const { width, height } = Dimensions.get("window");


export default class RidesView extends React.Component{

    state={
        ridesInfos:undefined,
        stations:undefined,
        mapSelected:undefined,
        user_pos:undefined,
    };


    getPoly(r){
        let idOrigin = r.stationStart;
        let idDest = r.stationEnd;

        let coordOrigin = this.state.stations[idOrigin];
        let coordDest = this.state.stations[idDest];

        let origin={
            latitude:coordOrigin[1],
            longitude:coordOrigin[2],
          }
          let dest={
            latitude:coordDest[1],
            longitude:coordDest[2],
          }

        let this_trajet = trajet(origin,dest,200);
        let maxLat = Math.max(origin.latitude, dest.latitude);
        let minLat = Math.min(origin.latitude, dest.latitude);
        let maxLon = Math.max(origin.longitude, dest.longitude);
        let minLon = Math.min(origin.longitude, dest.longitude);
        let coordonnees={
            latitude:(maxLat+minLat)/2,
            longitude:(maxLon+minLon)/2,
            latitudeDelta:maxLat-minLat+0.01,
            longitudeDelta:maxLon-minLon+0.01
          };
        return <MapView  
        style={{flex:1}} 
          initialRegion={coordonnees}>
              <AnimatedPolyline
			coordinates={this_trajet}
			strokeWidth={4}
			strokeColor={"rgba(230, 74, 30, 1)"}
			lineDashPattern={[5,1]}
			interval={20}
			delay={50}
			/></MapView>

    }
    RideItem (ride, stations){
        let r = ride.item;
        let color = "rgba(0,100,0,0.3)";
        let elec = r.elec;
        let broken = false;
        if(r.dist < 100){
            broken = true;
        }
        if (broken){
            color = "rgba(100,0,0,0.3)";
        }else if(elec){
            color = "rgba(0,0,100,0.3)";
        }
        var depart = stations[r.stationStart][0];
        var arrive = stations[r.stationEnd][0];
        let date = new Date(r.date);
        let timefin = new Date(date.getTime()+ r.duration*1000);
        return (
            <View style={styles.oneRide}>
                <View style={[styles.rideBloc,{backgroundColor:color}]}>
                    <View style={[styles.rowRideBloc]}>
                        <View>
                            <Text style={{color:"#a5a7c2"}}>
                                {depart}
                            </Text>
                        </View>
                    </View>
                    {(depart != arrive) &&
                        <View>
                            <View style={styles.rowRideBloc}>
                                <View>
                                    <Icon name='chevron-down'
                                    type='material-community'
                                    style={{marginRight:5}}
                                    color={"#a5a7c2"}
                                    size={20}/>
                                </View>
                            </View>
                            <View style={styles.rowRideBloc}>
                                <View>
                            <Text style={{color:"#a5a7c2"}}>
                                        {arrive}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={styles.divider}/>
                    <View style={styles.rowRideBloc}>
                        <View style={[styles.rideSubBloc]}>
                            <Icon name='calendar'
                            type='material-community'
                            style={{marginRight:5}}
                            color={"#a5a7c2"}
                            size={20}/>
                            <Text style={{color:"#a5a7c2"}}>
                                {date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()}
                            </Text>
                        </View>
                        {false &&
                            <Icon name='flash'
                            type='material-community'
                            style={{paddingTop:2}}
                            color={"#a5a7c2"}
                            size={20}/>
                        }
                        <View style={[styles.rideSubBloc]}>
                            <Icon name='clock'
                            type='material-community'
                            style={{marginRight:5}}
                            color={"#a5a7c2"}
                            size={20}/>
                            <Text style={{color:"#a5a7c2"}}>
                                {String(date.getHours()).padStart(2, "0")
                                +'h'
                                +String(date.getMinutes()).padStart(2, "0") 
                                + " - "
                                + String(timefin.getHours()).padStart(2, "0")
                                +'h'
                                + String(timefin.getMinutes()).padStart(2, "0") 
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowRideBloc} >
                        <View style={[styles.rideSubBloc]}>
                            <Icon name='bike'
                            type='material-community'
                            style={{marginRight:5}}
                            color={"#a5a7c2"}
                            size={20} />
                            <Text style={{color:"#a5a7c2"}}>
                                {r.dist/1000 + " km"}
                            </Text>
                        </View>
                        <View style={[styles.rideSubBloc]}>
                            <Icon name='pound-box'
                            type='material-community'
                            style={{marginRight:5}}
                            color={"#a5a7c2"}
                            size={20}/>
                            <Text style={{color:"#a5a7c2"}}>
                                {"ID : "+r.bikeId}
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                style={{flex:2}}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Report',{bikeId:r.bikeId, from:'Home'})}
                    underlayColor=''
                    style={styles.signaler} >
                        <Icon name='alert-circle'
                        type='material-community'
                        color="#fff"
                        size={25}/>
                </TouchableOpacity>
                { !broken &&
                <TouchableOpacity
                    underlayColor=''
                    onPress={() => this.setState({mapSelected:r})}
                    style={styles.see} >
                        <Icon name='eye'
                        type='material-community'
                        color="#fff"
                        size={25}/>
                </TouchableOpacity>
                }
                </View>
            </View>
        )
    
    }
    
    
    componentDidMount() {
        getItemValue("@rides_infos").then((res) => this.setState({ridesInfos:JSON.parse(res)}));
        getItemValue("@stations_infos").then((res) => this.setState({stations:dicoStations(JSON.parse(res))}));    
       
      }


    render() {

        if (this.state.ridesInfos == undefined || this.state.stations == undefined){
            return <Loading/>
        }

        let stations = this.state.stations;
        let rides = this.state.ridesInfos;
        let n = rides.length;
        for (let i =0; i < n;i++){
            rides[i]['id'] = "ride_"+i
        }
        return (
            <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={styles.topView}>
                    <Text style={styles.pseudo}>Trajets</Text>
            </View>
            <FlatList
                    data={rides.slice(0,100)}
                    renderItem={(item) => this.RideItem(item, stations)}
                    keyExtractor={item => item.id}
            />
            {this.state.mapSelected != undefined &&
            <View style={styles.map}>
            <View style={styles.submap}>
            {this.getPoly(this.state.mapSelected)}
            </View>
            <TouchableOpacity style={styles.closeButton}
            onPress={() => this.setState({mapSelected:undefined})}>
                <Text style={{color:"white",fontSize:21}}>
                    Fermer
                </Text>
            </TouchableOpacity>
            </View>
            }   
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgb(40, 62, 105)"
        },
    topView:{
        padding:15,
        backgroundColor:"rgb(25, 41, 71)",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"stretch",

    },
    map:{
        position:"absolute",
        width:width,
        height:height,
        alignItems:"center",
        justifyContent:"center",
       
    },
    submap:{ 
        width:width-100,
        height:height-200,
        borderColor:"rgb(25, 41, 71)",
        borderWidth:5,
        borderRadius:2
    },    
    pseudo:{
        fontSize:30,
        fontWeight:'700',
        color:"#d8deeb"
    
    },
    divider:{
        marginLeft:10,
        marginRight:10,
        height:1,
        marginTop:5,
        marginBottom:5,
        backgroundColor:'#a5a7c2'
    },
    rideBloc:{
        flex:7,
        margin:5,
        padding:5,
        alignItems:"stretch"
    },
    rowRideBloc:{
        flexDirection:"row",
        justifyContent:"center",
    },
    rideSubBloc:{
        flexDirection:'row',
        padding:5,
        flex:1
    },
    oneRide:{
        flexDirection:'row',
        marginTop:10,
    },
    signaler:{
        flex:1,
        alignSelf: 'stretch',
        margin:5,
        backgroundColor:"rgba(200,0,0,0.5)",
        justifyContent:"center",
        alignItems:"stretch",
        padding:10,
        
    },
    see:{
        flex:1,
        alignSelf: 'stretch',
        margin:5,
        backgroundColor:"rgba(100,100,0,0.5)",
        justifyContent:"center",
        alignItems:"stretch",
        padding:10
    },
    closeButton:
    {
        backgroundColor:"rgb(179, 64, 90)",
        padding:5,
        width:width-100,
        alignItems:"center",
        borderColor:"rgb(25, 41, 71)",
        borderTopWidth:0,
        borderWidth:5,
        borderRadius:2
    }
});