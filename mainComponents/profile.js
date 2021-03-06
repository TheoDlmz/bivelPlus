
import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StatusBar, Linking, Dimensions } from 'react-native';
import { Icon, SocialIcon } from 'react-native-elements'

import { getItemValue } from '../utils/storage'
import { deconnect } from '../api/connect'
import { connect } from '../api/connect'
import { popupMessage } from '../utils/miscellaneous'

import { ProfileButton, RideItem } from '../components/profileComponents'
import { Loading } from '../components/loading'
import { getStats } from '../utils/stats'
import UserReportsView from '../userComponents/reports'

import { profileStyle, loginStyle } from '../style/profileStyle'
import { generalStyle } from '../style/generalStyle'
import { veloBday } from '../utils/badgeFunctions';
const { width, height } = Dimensions.get("window");

import * as Font from 'expo-font';

let customFonts = {
    'MontserratRegular': require('../fonts/Montserrat-Regular.ttf'),
  };
  

export default class AccountView extends React.Component {

    state = {
        ridesInfos: undefined,
        userInfos: undefined,
        logged: undefined,
        email: "",
        password: "",
        scrollLayer: 0
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    componentDidMount() {
        this._loadFontsAsync();
        getItemValue("@last_update")
            .then((res) => { this.setState({ logged: true }); this.fetchData(res) })
            .catch(() => this.setState({ logged: false }));

    }

    loadData() {
        getItemValue("@rides_infos")
            .then((res) => this.setState({ ridesInfos: JSON.parse(res) }))
            .catch(() => this.setState({ logged: false }));
        getItemValue("@user_infos")
            .then((res) => this.setState({ userInfos: JSON.parse(res) }))
            .catch(() => this.setState({ logged: false }));

    }


    // Mets à jour les données au lancement de la vue si besoin
    async fetchData(last_update) {

        let d = new Date();
        let curr_date = d.toDateString();

        if (last_update == undefined) {
            this.setState({ logged: false })
            return
        }

        if (curr_date != last_update) {
            this.updateData();
        }

        this.loadData();
    }


    // Mise à jour des données
    async updateData() {
        popupMessage('info', 'Téléchargement des données', 'Cela devrait prendre quelques secondes');
        let email = await getItemValue("@username");
        let password = await getItemValue("@password");
        connect(email, password, true)
            .then(async () => {
                popupMessage('success', 'Infos mises à jour', 'Vos informations sont à jour');
                this.loadData();
            })
            .catch((err) =>
                popupMessage('error', 'Echec de mise à jour', err.message)
            );

    }

    // Déconnecte l'utilisateur
    deconnectUser() {
        deconnect()
            .then(() => {
                popupMessage('success', 'Déconnexion réussie', "Vous êtes déconnecté");
                this.setState({ logged: false })
            })
            .catch((err) =>
                popupMessage('error', 'Echec lors de la déconnexion', err.message)
            );
    }

    // Connecte l'utilisateur
    connectUser = async () => {
        popupMessage('info', 'Connexion en cours', 'Cela devrait prendre quelques secondes')
        connect(this.state.email, this.state.password, true)
            .then(async (success) => {
                if (success.code == "201") {
                    popupMessage('success', 'Compte activé', 'Votre compte est activé');
                    this.setState({ password: "" });
                } else if (success.code == "200") {
                    popupMessage('success', 'Connexion réussie', 'Vous êtes désormais connecté');
                    this.setState({ logged: true });
                    this.setState({ password: "", email: "" });
                    this.loadData();
                }
            })
            .catch((err) =>
                popupMessage('error', 'Connexion échouée', err.message)
            );
    }

    getnArray() {
        let nArray = [];
        for (let i = 0; i < 2; i++) {
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer / width - 1 / 2) <= i && (this.state.scrollLayer / width + 1 / 2) > i) {
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }
        return nArray
    }

    render() {

        /*
            Si l'utilisateur n'est pas connecté, on lui présente un tableau de connexion
        */
        if (this.state.logged == undefined) {
            return <Loading />
        }
        if (!this.state.logged) {
            let nArray = this.getnArray();

            return (

                <View style={{ height: height }}>
                    <ScrollView
                        snapToInterval={width}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        style={generalStyle.fullWidth}
                        onScroll={(e) => this.setState({ "scrollLayer": e.nativeEvent.contentOffset.x })}
                        horizontal>
                        <View style={{ width: width }}>
                            <UserReportsView
                                navigation={this.props.navigation}
                            />
                        </View>
                        <View style={[loginStyle.containerLogin, { width: width }]}>
                            <View style={generalStyle.topView}>
                                <Text style={generalStyle.title}>Se connecter</Text>
                            </View>
                            <View style={loginStyle.loginBox}>
                                <TextInput
                                    style={loginStyle.input}
                                    placeholder="adesse email"
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                />
                                <TextInput
                                    style={loginStyle.input}
                                    placeholder="mot de passe"
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    maxLength={20}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    value={this.state.password}
                                />
                                <TouchableOpacity
                                    onPress={() => this.connectUser()}
                                    style={loginStyle.buttonLogin}
                                >
                                    <Text style={loginStyle.buttonText}>
                                        Se connecter
                            </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: 30, backgroundColor: "#03031a", padding: 10 }}>
                                <Text style={{ textAlign: "center",fontFamily:"MontserratRegular", fontSize: 13, color: "#ccc" }}>
                                    <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}
                                    >Attention : {"\n"}
                                    </Text> Ceci n'est pas l'application officielle Vélib',
                        elle n'est pas gérée par Smovengo.
                        Ne rentrez pas vos identifiants Vélib'.  {"\n"}
                         Vous devez faire partie
                        de la béta-test pour vous connecter. Pour plus d'informations, suivez-nous
                        sur Twitter et Github.
                        </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", flexDirection: "row" }}>
                                <SocialIcon
                                    type='twitter'
                                    onPress={() => { Linking.openURL('https://twitter.com/BivelParis') }}
                                />
                                <SocialIcon
                                    light
                                    type='github'
                                    onPress={() => { Linking.openURL('https://github.com/TheoDlmz/bivelPlus') }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View style={generalStyle.bottomView}>
                        {nArray.map((whatWePush) => <View style={[generalStyle.bottomDot, { backgroundColor: whatWePush }]} />)}
                    </View>
                    <TouchableOpacity
                        style={{ position: "absolute", top: 15, left: 15 }}
                        underlayColor=""
                        onPress={() => this.props.navigation.navigate('Map')}
                    >
                        <Icon
                            name='map'
                            type='material-community'
                            color="#d8deeb"
                            size={42}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        /*
            Sinon, on affiche son profil. Il est divisé en trois parties :
                * La TopView avec les icones pour la carte, la mise à jour et le pseudo
                * Les 20 derniers trajets de l'utilisateurs
                * Les boutons pour accéder aux autres composants
        */

        let loaded = this.state.userInfos && this.state.ridesInfos;

        let name = "Loading...";
        let score = "Loading...";
        let n = 0;
        let indexs = [];

        let rides = this.state.ridesInfos;
        if (loaded) {
            name = this.state.userInfos['generalDetails']['customerDetails']['name']['firstName']
                + " "
                + this.state.userInfos['generalDetails']['customerDetails']['name']['lastName'][0] + ".";

            let infosDists = getStats(rides);
            score = Math.round(infosDists.total) + " km";
            n = Math.min(20, rides.length);
            indexs = [...Array(n).keys()];
        }

        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />


                <View style={profileStyle.topView}>
                    <View style={generalStyle.sideTopView}>
                        <TouchableOpacity
                            underlayColor=""
                            onPress={() => this.props.navigation.navigate('Map')}
                        >
                            <Icon
                                name='map'
                                type='material-community'
                                color="#d8deeb"
                                size={42}
                            />
                        </TouchableOpacity>
                        <Text style={profileStyle.sideTopText}>
                            Map
                    </Text>
                    </View>
                    <View style={generalStyle.center}>
                        <Text style={profileStyle.pseudoText}>
                            {name}
                        </Text>
                        <Text style={profileStyle.scoreText}>
                            {score}
                        </Text>
                    </View>
                    <View style={generalStyle.sideTopView}>
                        <TouchableOpacity
                            onPress={() => this.updateData()}
                            underlayColor=""
                        >
                            <Icon
                                name='update'
                                type='material-community'
                                color="#d8deeb"
                                size={42}
                            />
                        </TouchableOpacity>
                        <Text style={profileStyle.sideTopText}>
                            Update
                    </Text>
                    </View>
                </View>



                <ScrollView
                    style={profileStyle.lastRides}
                    snapToInterval={160}
                    horizontal
                >
                    {indexs.map(index => <RideItem params={rides[index]} />)}
                </ScrollView>


                <View style={profileStyle.buttonView}>
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('Rides')}
                        icon="bike"
                        title="Trajets"
                    />
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('MapRides')}
                        icon="map-marker-circle"
                        title="Carte"
                    />
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('Stats')}
                        icon="finance"
                        title="Statistiques"
                    />
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('Badges')}
                        icon="star-circle"
                        title="Badges"
                    />
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('UserReports')}
                        icon="alert-circle"
                        title="Signalements"
                    />
                    <ProfileButton
                        onPress={() => this.props.navigation.navigate('Ranking')}
                        icon="podium"
                        title="Classement"
                    />
                </View>
                <TouchableOpacity
                    style={profileStyle.logOutButton}
                    onPress={() => this.deconnectUser()}
                >
                    <Text style={profileStyle.textButton}>
                        Deconnexion
                </Text>
                </TouchableOpacity>
            </View>)
    }
}