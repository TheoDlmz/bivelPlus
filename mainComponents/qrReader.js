import * as React from 'react';
import { Text, View, ActivityIndicator, TextInput, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';

import {getItemValue} from '../utils/storage';

import {dicoStations} from '../utils/general';
import {closest_station} from '../utils/mapFunctions'

import {sleep, popupMessage} from '../utils/miscellaneous'

import {qrReaderStyle} from '../style/reportStyle'
import {generalStyle} from '../style/generalStyle'

const { width, height } = Dimensions.get("window");

export default class QRScreen extends React.Component{

    state = {
        permission:undefined,
        scanned:false,
        idVelib:"",
        user_pos:undefined,
        stations:undefined,
    }

    componentDidMount() {
        BarCodeScanner.requestPermissionsAsync()
            .then((res)=> this.setState({permission:res}))
            .catch();
        getItemValue("@stations_infos")
            .then((res) => this.setState({stations:dicoStations(JSON.parse(res))}))
            .catch();
    }

    goToReport(idVelib){
        
        this.setState({idVelib:""});
        Location.getCurrentPositionAsync({})
            .then((location) => { 
                let user_pos = {
                latitude:location.coords.latitude,
                longitude:location.coords.longitude};
                let stations = this.state.stations;
                let closest = closest_station(user_pos, stations)[0];
                this.props.navigation.navigate('Report',{bikeId:idVelib,closest:closest, from:'Map'});
                this.setState({scanned:false});
                })
            .catch(() => {
                this.props.navigation.navigate('Report',{bikeId:idVelib,closest:undefined, from:'Map'});
                this.setState({scanned:false});
            });

    }

    handleIdEntered = () => {
        let idVelib = this.state.idVelib;
        this.setState({scanned:true});
        this.goToReport(idVelib);
    }
    handleBarCodeScanned = ({ type, data }) => {

        this.setState({scanned:true});

        if (type != 256){
            this.setState({scanned:false});
            return
        }
        let string_qr = "http://qrcodes.smoove.pro/qrcode/FP_"
        let string_qr_sub = "http://qrcodes.smoove.pro/"
        sleep(3000).then(() => this.setState({scanned:false}));
        
        // On teste si c'est une bon lien
        if (data.substring(0,string_qr.length) != string_qr){
            if (data.substring(0,string_qr_sub.length) == string_qr_sub){
                popupMessage("error", 'Le QR Code de ce Vélib n\'est pas à jour', 'Merci Smovengo :-)');
            }else{
                popupMessage("error", 'QR Code non reconnu', 'Ce n\'est pas un QR Code Vélib');
            }
            return
        }

        let qr = data.substring(string_qr.length,string_qr.length+5);
        let idVelib = parseInt(qr);
        this.goToReport(idVelib);
    };
    

    render(){


        if (this.state.permission == undefined){
            return <View style={[generalStyle.container,generalStyle.center]}>
                <Text style={qrReaderStyle.errorMessage}>
                    Accorder permission caméra
                </Text>
            </View>
        }else if (this.state.permission == false){
            return <View style={[generalStyle.container,generalStyle.center]}>
                <Text style={qrReaderStyle.errorMessage}>
                    Pas d'accès caméra
                </Text>
            </View>
        }

        return (
            <View style={[generalStyle.container,generalStyle.center]}>
                <StatusBar hidden={true} />
                <BarCodeScanner
                    onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                    style={{position:"absolute",height:height,width:width}}
                />
                <View style={qrReaderStyle.topTextView}>
                    <Text style={qrReaderStyle.textScanQR}>Scannez le QR Code</Text>
                </View>
                {this.state.idVelib.length < 4 &&
                    <View style={qrReaderStyle.decoCamera}>
                    {this.state.scanned &&
                        <ActivityIndicator
                            animating = {true}
                            color = 'white'
                            size = "large"/>
                    }
                    </View>
                }
                {this.state.idVelib.length >= 4 &&
                <TouchableOpacity 
                    style={qrReaderStyle.goButton}
                    onPress={() =>  this.handleIdEntered()}
                >
                    <Text style={qrReaderStyle.goText}>
                        GO !
                    </Text>
                </TouchableOpacity>
                }
               
                <TextInput
                    style={qrReaderStyle.inputId}
                    placeholder={"Ou entrez l'ID du Vélib"}
                    placeholderTextColor={"rgba(255,255,255,0.6)"}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={this.state.idVelib}
                    onChangeText={(text) => this.setState({"idVelib":text})}
                />
            </View>
          );
    }
}
