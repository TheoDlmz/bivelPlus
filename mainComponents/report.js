import * as React from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { Icon } from 'react-native-elements';

import { fileReport } from '../api/reportVelib';
import { getItemValue } from '../utils/storage';

const { width, height } = Dimensions.get("window");

import { reportStyle} from '../style/reportStyle'
import { generalStyle } from '../style/generalStyle'


export default class SignalScreen extends React.Component {

    state = {
        error: require('../json/report.json'),
        bikeId: this.props.route.params.bikeId,
        from: this.props.route.params.from,
        closest: this.props.route.params.closest,
        currentError: undefined,
        user: undefined,
        bivelId: undefined,
        finalMessage: "Rapport en cours d'envoi...",
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
            .then(() => this.setState({ finalMessage: "Rapport envoyé avec succès !" }))
            .catch(() => { this.setState({ finalMessage: "Erreur dans l'envoi du rapport." }) })

    }

    componentDidMount() {
        getItemValue("@bivel_infos")
            .then((res) => this.setState({ bivelId: JSON.parse(res).id }))
            .catch();
        getItemValue("@user_infos")
            .then((res) => this.setState({ user: JSON.parse(res) }))
            .catch();

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
                                        source={{ uri: 'http://theo.delemazure.fr/bivelAPI/reports/' + e.pic }}
                                    />
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {e.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>)
                        }
                    </View>



                    <View style={reportStyle.containerBoxes}>
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
                    </View>


                    <View style={reportStyle.displayMessage}>
                        <View style={reportStyle.reportMessage}>
                            <Text style={{ fontSize: 25 }}>
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
                                        color="rgb(212, 49, 0)"
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
                                <View style={[reportStyle.boxError2,reportStyle.boxAgain]}
                                >
                                    <Icon
                                        name='cached'
                                        type='material-community'
                                        color="rgb(66, 109, 158)"
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
