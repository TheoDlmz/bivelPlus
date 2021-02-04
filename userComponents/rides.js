import * as React from 'react';
import { Text, View, FlatList, TouchableOpacity, StatusBar } from 'react-native';

import {Loading} from '../components/loading'
import { getItemValue } from '../utils/storage'

import { dicoStations } from '../utils/general'
import { RideMapView, RideItemView } from '../components/ridesComponents'

import { generalStyle } from '../style/generalStyle'
import { ridesStyle } from '../style/ridesStyle'




export default class RidesView extends React.Component {

    state = {
        ridesInfos: undefined,
        stations: undefined,
        mapSelected: undefined,
    };

    componentDidMount() {
        getItemValue("@rides_infos").then((res) => this.setState({ ridesInfos: JSON.parse(res) }));
        getItemValue("@stations_infos").then((res) => this.setState({ stations: dicoStations(JSON.parse(res)) }));

    }
    
    render() {

        if (this.state.ridesInfos == undefined || this.state.stations == undefined) {
            return <Loading />
        }

        let stations = this.state.stations;
        let rides = this.state.ridesInfos;
        let n = rides.length;
        for (let i = 0; i < n; i++) {
            rides[i]['id'] = "ride_" + i
        }
        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />
                <View style={generalStyle.topView}>
                    <Text style={generalStyle.title}>Trajets</Text>
                </View>
                <FlatList
                    data={rides.slice(0, 100)}
                    renderItem={(item) => (                       
                        <RideItemView
                        ride={{
                            details:item.item,
                            origin:stations[item.item.stationStart][0],
                            dest:stations[item.item.stationEnd][0]
                        }}
                        onPressReport={() => this.props.navigation.navigate('Report', { bikeId: r.bikeId, from: 'Home' })}
                        onPressSee={() => this.setState({ mapSelected: r })}
                        />)}
                    keyExtractor={item => item.id}
                />
                {this.state.mapSelected != undefined &&
                    <View style={ridesStyle.seeRideView}>
                        <View style={ridesStyle.seeRideMapView}>
                            <RideMapView
                                ride={{
                                    origin: this.state.stations[this.state.mapSelected.stationStart],
                                    dest: this.state.stations[this.state.mapSelected.stationEnd]
                                }}
                            />
                        </View>
                        <TouchableOpacity style={ridesStyle.closeButton}
                            onPress={() => this.setState({ mapSelected: undefined })}>
                            <Text style={ridesStyle.closeButtonText}>
                                Fermer
                        </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

