import * as React from 'react';
import { Text, View, Dimensions, StatusBar, ScrollView, TouchableHighlight } from 'react-native';
import MapView, { Circle } from 'react-native-maps';

import { Loading } from '../components/loading'
import { getItemValue } from '../utils/storage'

import { getStats } from '../utils/stats'
import { compute_badges, compute_events, compute_mesures, compute_voyages } from '../utils/badgeFunctions'
import {BadgeItem} from '../components/badgesComponents'

import { generalStyle } from '../style/generalStyle'
import {badgesStyle} from '../style/badgesStyle'

const { width, height } = Dimensions.get("window");

const badges = require('../json/badges.json');
const event = require('../json/event.json');
const voyages = require('../json/voyages.json')

export default class BadgeView extends React.Component {

    state = {
        ridesInfos: undefined,
        paymentsInfos: undefined,
        userInfos: undefined,
        activeBadge: undefined,
        kind: undefined,

        infosDists: undefined,
        voyage_max: undefined,
        badges_obtained: undefined,
        badges_blurred: undefined,
        event_list: undefined,

        scrollLayer: 0
    };

    componentDidMount() {

        getItemValue("@rides_infos")
            .then((rides_infos) => {
                getItemValue("@user_infos")
                .then((user_infos) => {
                    let u_infos = JSON.parse(user_infos);
                    let rides = JSON.parse(rides_infos);
                    let infosDists = getStats(rides);
                    let mesures = compute_mesures(rides, u_infos['generalDetails']['customerDetails']['birthDate']);
                    let voyage_max = compute_voyages(mesures, voyages);
                    let badges_list = compute_badges(mesures, badges);
                    let badges_obtained = badges_list.obtained;
                    let badges_blurred = badges_list.not_obtained;
                    let event_list = compute_events(rides, event);
                    this.setState({
                        infosDists: infosDists,
                        voyage_max: voyage_max,
                        badges_blurred: badges_blurred,
                        badges_obtained: badges_obtained,
                        event_list: event_list
                    })
                })
                .catch()
            })
            .catch();

    }


    getCurrentBadge() {
        let description;
        let titre;
        if (this.state.kind != undefined) {
            if (this.state.kind == "badge") {
                let level = this.state.activeBadge.level;
                let descs = this.state.activeBadge.badge.Descriptions;
                level = descs.length + level - 3;
                description = descs[level].Description;
                titre = this.state.activeBadge.badge.Titre;
            } else if (this.state.kind == "event") {
                description = this.state.activeBadge.Description;
                titre = this.state.activeBadge.Titre;
            } else if (this.state.kind == "voyage") {
                description = "Félicitation ! Vous avez parcouru plus de "
                    + this.state.activeBadge.Dist
                    + " km, soit la distance en vol d'oiseau entre Paris et "
                    + this.state.activeBadge.Ville
                    + ", "
                    + this.state.activeBadge.Pays
                    + " !";
                titre = this.state.activeBadge.Ville
                    + " ("
                    + this.state.activeBadge.Dist
                    + " km)";
            }
        }
        return { description: description, titre: titre }
    }


    getnArray() {
        let nArray = [];
        for (let i = 0; i < 3; i++) {
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer / width - 1 / 2) <= i && (this.state.scrollLayer / width + 1 / 2) > i) {
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }
        return nArray
    }


    render() {

        if (this.state.infosDists == undefined) {
            return <Loading />
        }

        let currentBadge = this.getCurrentBadge();
        let titre = currentBadge.titre;
        let description = currentBadge.description

        let nArray = this.getnArray();

        return (
        <View style={generalStyle.container}>
            <StatusBar hidden={true} />
            <View style={generalStyle.topView}>
                <Text style={generalStyle.title}>Badges</Text>
            </View>
            <ScrollView
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={generalStyle.fullWidth}
                onScroll={(e) => this.setState({ "scrollLayer": e.nativeEvent.contentOffset.x })}
                horizontal>
                <ScrollView
                    style={generalStyle.fullWidth}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={badgesStyle.titleContainer}>
                        <Text style={badgesStyle.titleText}>
                            Accomplissements
                        </Text>
                    </View>
                    <View style={badgesStyle.badgeContainer}>
                        {this.state.badges_obtained.map(index =>
                            <BadgeItem
                                index={badges[index.id]}
                                onPress={() => this.setState({
                                    activeBadge: { "badge": badges[index.id], "level": index.level },
                                    kind: "badge"
                                })}
                                level={index.level}
                                kind="badge" />)}
                        {this.state.badges_blurred.map(index =>
                            <BadgeItem
                                onPress={() => { }}
                                index={badges[index]}
                                kind="blurred" />)}
                    </View>
                </ScrollView>

                <ScrollView
                    style={generalStyle.fullWidth}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={badgesStyle.titleContainer}>
                        <Text style={badgesStyle.titleText}>
                            Carnet de Voyages
                        </Text>
                    </View>
                    <MapView
                        minZoomLevel={0}
                        style={badgesStyle.mapStyle}
                        initialRegion={{
                            latitude: 48.864716,
                            longitude: 2.349014,
                            latitudeDelta: this.state.infosDists.total / 50,
                            longitudeDelta: this.state.infosDists.total / 50,
                        }}>
                        <Circle
                            center={{
                                latitude: 48.864716,
                                longitude: 2.349014
                            }}
                            radius={this.state.infosDists.total * 1000}
                            fillColor="rgba(150,50,50,0.3)"
                            strokeColor="rgba(150,50,50,0.8)"
                            strokeWidth={5}
                        />
                    </MapView>
                    <View style={badgesStyle.badgeContainer}>
                        {voyages.slice(0, this.state.voyage_max).map(index =>
                            <BadgeItem
                                onPress={() => this.setState({
                                    activeBadge: index,
                                    kind: "voyage"
                                })}
                                index={index}
                                kind="voyage" />)}
                        <BadgeItem
                            onPress={() => { }}
                            index={voyages[this.state.voyage_max]}
                            kind="blurred" />
                    </View>
                </ScrollView>


                <ScrollView
                    style={generalStyle.fullWidth}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={badgesStyle.titleContainer}>
                        <Text style={badgesStyle.titleText}>
                            Evenements
                        </Text>
                    </View>
                    <View style={badgesStyle.badgeContainer}>
                        {this.state.event_list.map(index =>
                            <BadgeItem
                                onPress={() => this.setState({
                                    activeBadge: event[index],
                                    kind: "event"
                                })}
                                index={event[index]}
                                kind="event" />)}
                    </View>
                </ScrollView>
            </ScrollView>


            {(this.state.activeBadge != undefined) &&
                <View
                    style={badgesStyle.whiteOverlay}>

                    <TouchableHighlight
                        style={badgesStyle.TouchableOverlay}
                        onPress={() => this.setState({ activeBadge: undefined, kind: undefined })}
                        activeOpacity={1}
                        underlayColor="">
                        <View
                            style={badgesStyle.messageBadge}>
                            <Text style={badgesStyle.badgeTitle}>
                                {titre}
                            </Text>
                            <Text style={badgesStyle.badgeDesc}>
                                {description}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            }

            <View style={generalStyle.bottomView}>
                {nArray.map((whatWePush) => <View style={[generalStyle.bottomDot, { backgroundColor: whatWePush }]} />)}
            </View>
        </View>);
    }
}

