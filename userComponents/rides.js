import * as React from 'react';
import { Text, View, FlatList, TouchableOpacity, TouchableHighlight, StatusBar } from 'react-native';

import { Loading } from '../components/loading'
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
        list_broken: []
    };

    componentDidMount() {
        getItemValue("@rides_infos")
            .then((res) => this.setState({ ridesInfos: JSON.parse(res) }))
            .catch();
        getItemValue("@reports")
            .then((res) => { 
                let idvelibs = [];
                let reports = JSON.parse(res);
                for (let i =0; i < reports.length; i++){
                    idvelibs.push(reports[i].velib_id);
                }
                this.setState({list_broken:idvelibs})
            }).catch();
        getItemValue("@stations_infos")
            .then((res) => this.setState({ stations: dicoStations(JSON.parse(res)) }))
            .catch();
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
                                details: item.item,
                                origin: stations[item.item.stationStart][0],
                                dest: stations[item.item.stationEnd][0]
                            }}
                            broken={this.state.list_broken}
                            onPressReport={() => this.props.navigation.navigate('Report', { bikeId: item.item.bikeId, from: 'Home' })}
                            onPressSee={() => this.setState({ mapSelected: item.item })}
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
                        <TouchableHighlight style={ridesStyle.closeButton}
                            underlayColor={"#540a08"}
                            onPress={() => this.setState({ mapSelected: undefined })}>
                            <Text style={ridesStyle.closeButtonText}>
                                Fermer
                        </Text>
                        </TouchableHighlight>
                    </View>
                }
            </View>
        )
    }
}

