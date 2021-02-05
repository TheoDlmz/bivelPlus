import * as React from 'react';
import { Text, View, Dimensions, ScrollView, StatusBar } from 'react-native';

import { Loading } from '../components/loading'
import { getItemValue } from '../utils/storage'

import { getStats, getStatsItems } from '../utils/stats'
import {
    Night, Speed, DistOneDay, CumulDist,
    DistRides, HourDist, DayDist, MonthDist
} from '../components/chartsComponents'

import { StatsTableItem } from '../components/statsComponents'

const { width, height } = Dimensions.get("window");

import { generalStyle } from '../style/generalStyle'



export default class StatsView extends React.Component {

    state = {
        name: undefined,
        userInfos: undefined,
        scrollLayer: 0
    };

    componentDidMount() {
        getItemValue("@rides_infos")
            .then((ridesJSON) =>
                getItemValue("@payments_infos")
                    .then((payments) => {
                        let paymentsInfos = JSON.parse(payments);
                        let ridesInfos = JSON.parse(ridesJSON);

                        let rides = ridesInfos;
                        let totalMoney = paymentsInfos;
                        let infosDists = getStats(rides);

                        let userInfos = {
                            totalMoney: totalMoney,
                            infosDists: infosDists
                        }
                        let statsItem = getStatsItems(userInfos);
                        this.setState({
                            rides: rides,
                            statsItem: statsItem
                        })
                    })

            );
    }

    getnArray() {
        let nArray = [];
        for (let i = 0; i < 9; i++) {
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer / width - 1 / 2) <= i && (this.state.scrollLayer / width + 1 / 2) > i) {
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }
        return nArray;

    }

    render() {

        if (this.state.rides == undefined || this.state.statsItem == undefined) {
            return <Loading />
        }

        let rides = this.state.rides;
        let statsItem = this.state.statsItem;
        let nArray = this.getnArray();

        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />
                <View style={generalStyle.topView}>
                    <Text style={generalStyle.title}>Statistiques</Text>
                </View>
                <ScrollView
                    snapToInterval={width}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    style={generalStyle.fullWidth}
                    onScroll={(e) => this.setState({ "scrollLayer": e.nativeEvent.contentOffset.x })}
                    horizontal>
                    <View style={generalStyle.fullWidth}>
                        <View style={{ flex: 1, padding: 20, alignItems: "stretch" }}>
                            <View style={{ justifyContent: "center", marginBottom: 10 }}>
                                <Text style={{ fontSize: 20, textAlign: "center", color: "#ddd" }}>
                                    Statistiques
                                <Text style={{ color: 'rgba(99, 230, 219,0.7)', fontWeight: "bold" }}> Générales</Text>.
                            </Text>
                            </View>
                            {statsItem.map((params) => <StatsTableItem params={params} />)
                            }
                        </View>
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <CumulDist rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <MonthDist rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <DistRides rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <Speed rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <HourDist rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <DayDist rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <DistOneDay rides={rides} />
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <Night rides={rides} />
                    </View>
                </ScrollView>
                <View style={generalStyle.bottomView}>
                    {nArray.map((whatWePush) => {
                        return (
                            <View style={[generalStyle.bottomDot, { backgroundColor: whatWePush }]} />)
                    })}
                </View>
            </View>
        )
    }
}


