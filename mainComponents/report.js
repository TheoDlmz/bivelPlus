import * as React from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity, StatusBar, ScrollView, BackHandler } from "react-native";
import { Icon } from 'react-native-elements';

import { fileReport } from '../api/reportVelib';
import { getItemValue } from '../utils/storage';
import { fetchReports } from '../api/getReports';
import { getJson } from '../api/getJsonFile'

import { reportStyle } from '../style/reportStyle'
import { generalStyle } from '../style/generalStyle'
import { TextInput } from 'react-native';
import { popupMessage } from '../utils/miscellaneous';

import * as Font from 'expo-font';

let customFonts = {
    'MontserratRegular': require('../fonts/Montserrat-Regular.ttf'),
    'MontserratBold': require('../fonts/Montserrat-Bold.ttf'),
};

const { width, height } = Dimensions.get("window");

export default class SignalScreen extends React.Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    state = {
        error: [],
        bikeId: this.props.route.params.bikeId,
        from: this.props.route.params.from,
        closest: this.props.route.params.closest,
        currentError: undefined,
        user: undefined,
        bivelId: undefined,
        finalMessage: "Rapport en cours d'envoi...",
        other: "",
        total: 0
    }

    sendReport(e) {
        this.scrollLayer.scrollTo({ x: 2 * width })

        let user = {
            id: "",
            firstname: "Anonyme",
            lastname: "Anonyme",
            email: "Anonyme"
        }
        if (this.state.user) {
            user = {
                id: this.state.user['generalDetails']['customerInternalCode'],
                email: this.state.user['generalDetails']['customerDetails']['contactDetails']['email'],
                firstname: this.state.user['generalDetails']['customerDetails']['name']['firstName'],
                lastname: this.state.user['generalDetails']['customerDetails']['name']['lastName'],
            }
        }

        fileReport(this.state.bikeId, user, e, this.state.bivelId, this.state.closest)
            .then(() => { this.scrollLayerMini.scrollToEnd({ duration: 2500 }); this.setState({ finalMessage: "Rapport envoyé avec succès !" }) })
            .catch(() => { this.setState({ finalMessage: "Erreur dans l'envoi du rapport." }) })

    }
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }
    componentDidMount() {
        this._loadFontsAsync();
        getItemValue("@bivel_infos")
            .then((res) => this.setState({ bivelId: JSON.parse(res).id }))
            .catch();
        getItemValue("@user_infos")
            .then((res) => this.setState({ user: JSON.parse(res) }))
            .catch();
        fetchReports()
            .then((res) => this.setState({ total: res.data }))
            .catch();
        getJson("report.json")
            .then((res) => this.setState({ error: res.data }))
            .catch(() => popupMessage("error", "Pas de connexion", "Vous devez vous connecter à internet pour signaler un Vélib"))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        if (this.state.currentError) {
            this.setState({ currentError: undefined });
            this.scrollLayer.scrollTo({ x: 0 })
        } else {
            this.props.navigation.goBack();
        }
        return true;
    }

    goback() {
        if (this.state.from == "Home") {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.navigate('Map');
        }
    }


    render() {
        let xtab = []
        if (this.state.currentError != undefined) {
            xtab = this.state.currentError['subIssues'];
        }
        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />
                <View style={generalStyle.topView}>
                    <Text style={generalStyle.title}>{"Signalement #" + this.state.bikeId}</Text>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    ref={(node) => this.scrollLayer = node}
                >


                    <View style={reportStyle.containerBoxes}>
                        {this.state.error.map((e) =>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ currentError: e });
                                    this.scrollLayer.scrollTo({ x: width })
                                }}
                            >
                                <View style={reportStyle.boxError1}>
                                    <Image
                                        style={reportStyle.imageError}
                                        source={{ uri: 'http://theo.delemazure.fr/bivelAPI/reports_pic/' + e.pic }}
                                    />
                                    <Text style={{ fontFamily:"MontserratBold", }}>
                                        {e.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>)
                        }
                    </View>



                    <ScrollView style={reportStyle.containerBoxes}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ currentError: undefined }); this.scrollLayer.scrollTo({ x: 0 }) }}
                            underlayColor=''
                        >
                            <View style={[reportStyle.boxError2, reportStyle.boxRetour]}
                            >
                                <Icon
                                    name='arrow-left'
                                    type='material-community'
                                    color="#ddd"
                                    size={20}
                                    marginRight={10}
                                />
                                <Text style={reportStyle.textRetour}>
                                    Retour
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.currentError &&
                            xtab.map((e) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this.sendReport(e)}
                                    >
                                        <View style={reportStyle.boxError2}>
                                            <Text style={reportStyle.reportMessage}>
                                                {e.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>)
                            })
                        }
                        <View
                            style={reportStyle.textInput}>
                            <TextInput
                                placeholder="Autre (décrire le problème)"
                                textAlign="center"
                                style={reportStyle.textInputText}
                                maxLength={250}
                                onChangeText={(text) => this.setState({ other: text })}
                                value={this.state.other}
                            />
                            <TouchableOpacity
                                style={reportStyle.textInputSubmit}
                                onPress={() => this.sendReport({
                                    error: "Autre",
                                    message: this.state.other,
                                    sc: "Autre",
                                    ssc: "Autre"
                                })}>
                                <Icon
                                    name='check'
                                    type='material-community'
                                    color="#ddd"
                                    size={35}
                                    marginRight={10}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>


                    <View style={[reportStyle.displayMessage, { marginTop: -20 }]}>
                        <View style={{ height: 70 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                ref={(node) => this.scrollLayerMini = node}
                                scrollEnabled={false}>
                                <Text style={{fontFamily:"MontserratRegular", fontSize: 62, color: "#eee", alignSelf: "center" }}>
                                    {parseInt(this.state.total)}
                                </Text>

                                <Text style={{fontFamily:"MontserratRegular", fontSize: 62, color: "#eee", alignSelf: "center" }}>
                                    {parseInt(this.state.total) + 1}
                                </Text>
                            </ScrollView>
                        </View>
                        <View style={reportStyle.reportMessage}>
                            <Text style={reportStyle.reportMessageText}>
                                {this.state.finalMessage}
                            </Text>
                        </View>
                        <View style={reportStyle.containerBoxes}>
                            <TouchableOpacity
                                onPress={() => this.goback()}
                                underlayColor=''
                            >
                                <View style={[reportStyle.boxError2, reportStyle.boxRetour]}>
                                    <Icon
                                        name='arrow-left'
                                        type='material-community'
                                        color="#ddd"
                                        size={20}
                                        marginRight={10}
                                    />
                                    <Text style={reportStyle.textRetour}>
                                        Retour
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('QR')}
                                underlayColor=''
                            >
                                <View style={[reportStyle.boxError2, reportStyle.boxAgain]}
                                >
                                    <Icon
                                        name='cached'
                                        type='material-community'
                                        color="#ddd"
                                        size={20}
                                        marginRight={10}
                                    />
                                    <Text style={reportStyle.textRetour}>
                                        Scanner un autre Vélib'
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>)
    }
}

