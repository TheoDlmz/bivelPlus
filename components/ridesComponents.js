import React, { Component } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { AnimatedPolyline } from './mapsComponents'
import { Icon } from 'react-native-elements'

import {trajet} from '../utils/mapFunctions'
import {rideItemStyle } from '../style/ridesStyle'

export class RideMapView extends Component {

    state = {
        origin: this.props.ride.origin,
        dest: this.props.ride.dest
    }


    render() {
        let origin = {
            latitude: this.state.origin[1],
            longitude: this.state.origin[2],
        }
        let dest = {
            latitude: this.state.dest[1],
            longitude: this.state.dest[2],
        }

        let this_trajet = trajet(origin, dest, 200);
        let maxLat = Math.max(origin.latitude, dest.latitude);
        let minLat = Math.min(origin.latitude, dest.latitude);
        let maxLon = Math.max(origin.longitude, dest.longitude);
        let minLon = Math.min(origin.longitude, dest.longitude);
        let coordonnees = {
            latitude: (maxLat + minLat) / 2,
            longitude: (maxLon + minLon) / 2,
            latitudeDelta: maxLat - minLat + 0.01,
            longitudeDelta: maxLon - minLon + 0.01
        };
        return (<MapView
            style={{ flex: 1 }}
            initialRegion={coordonnees}>
            <AnimatedPolyline
                coordinates={this_trajet}
                strokeWidth={4}
                strokeColor={"rgba(230, 74, 30, 1)"}
                lineDashPattern={[5, 1]}
                interval={20}
                delay={50}
            />
        </MapView>)
    }
}



export class RideItemView extends Component {
    state = {
        ride:this.props.ride.details,
        origin:this.props.ride.origin,
        dest:this.props.ride.dest
    }


    render(){
        let r = this.state.ride;
        let color = "rgba(50,200,50,0.3)";
        let elec = r.elec;
        let broken = false;
        if (r.dist < 100) {
            broken = true;
        }
        if (broken) {
            color = "rgba(200,50,50,0.3)";
        } else if (elec) {
            color = "rgba(50,50,200,0.3)";
        }
        var depart = this.state.origin;
        var arrive = this.state.dest;
        let date = new Date(r.date);
        let timefin = new Date(date.getTime() + r.duration * 1000);
        return (
            <View style={rideItemStyle.oneRide}>
                <View style={[rideItemStyle.rideBloc, { backgroundColor: color }]}>
                    <View style={[rideItemStyle.rowRideBloc]}>
                        <View>
                            <Text style={rideItemStyle.textInfo}>
                                {depart}
                            </Text>
                        </View>
                    </View>
                    {(depart != arrive) &&
                        <View>
                            <View style={rideItemStyle.rowRideBloc}>
                                <View>
                                    <Icon name='chevron-down'
                                        type='material-community'
                                        style={{ marginRight: 5 }}
                                        color={"#ddd"}
                                        size={20} />
                                </View>
                            </View>
                            <View style={rideItemStyle.rowRideBloc}>
                                <View>
                                    <Text style={rideItemStyle.textInfo}>
                                        {arrive}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={rideItemStyle.divider} />
                    <View style={rideItemStyle.rowRideBloc}>
                        <View style={rideItemStyle.rideSubBloc}>
                            <Icon name='calendar'
                                type='material-community'
                                style={{ marginRight: 5 }}
                                color={"#ddd"}
                                size={20} />
                            <Text style={rideItemStyle.textInfo}>
                                {date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}
                            </Text>
                        </View>
                        {false &&
                            <Icon name='flash'
                                type='material-community'
                                style={{ paddingTop: 2 }}
                                color={"#ddd"}
                                size={20} />
                        }
                        <View style={rideItemStyle.rideSubBloc}>
                            <Icon name='clock'
                                type='material-community'
                                style={{ marginRight: 5 }}
                                color={"#ddd"}
                                size={20} />
                            <Text style={rideItemStyle.textInfo}>
                                {String(date.getHours()).padStart(2, "0")
                                    + 'h'
                                    + String(date.getMinutes()).padStart(2, "0")
                                    + " - "
                                    + String(timefin.getHours()).padStart(2, "0")
                                    + 'h'
                                    + String(timefin.getMinutes()).padStart(2, "0")
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={rideItemStyle.rowRideBloc} >
                        <View style={rideItemStyle.rideSubBloc}>
                            <Icon name='bike'
                                type='material-community'
                                style={{ marginRight: 5 }}
                                color={"#ddd"}
                                size={20} />
                            <Text style={rideItemStyle.textInfo}>
                                {r.dist / 1000 + " km"}
                            </Text>
                        </View>
                        <View style={rideItemStyle.rideSubBloc}>
                            <Icon name='pound-box'
                                type='material-community'
                                style={{ marginRight: 5 }}
                                color={"#ddd"}
                                size={20} />
                            <Text style={rideItemStyle.textInfo}>
                                {"ID : " + r.bikeId}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 2 }}>
                    <TouchableOpacity
                        onPress={this.props.onPressReport}
                        underlayColor=''
                        style={rideItemStyle.boutonRide} >
                        <Icon name='alert-circle'
                            type='material-community'
                            color="#fff"
                            size={25} />
                    </TouchableOpacity>
                    {!broken &&
                        <TouchableOpacity
                            underlayColor=''
                            onPress={this.props.onPressSee}
                            style={[rideItemStyle.boutonRide,{backgroundColor: "rgba(100,100,0,0.5)"}]} >
                            <Icon name='eye'
                                type='material-community'
                                color="#fff"
                                size={25} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}