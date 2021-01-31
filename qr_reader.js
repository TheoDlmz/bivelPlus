import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';

import {getItemValue} from './api/storage';

import {dicoStations} from './rides_functions/general';
import {closest_station} from './rides_functions/mapFunctions'

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const { width, height } = Dimensions.get("window");

export default class QRScreen extends React.Component{

    state =
    {permission:undefined,
    scanned:false,
    idVelib:"",
    user_pos:undefined,
    stations:undefined}

    componentDidMount() {

        BarCodeScanner.requestPermissionsAsync().then((res)=> this.setState({permission:res}));  
        getItemValue("@stations_infos").then((res) => this.setState({stations:dicoStations(JSON.parse(res))}));
        
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({scanned:true});
        if (type != 256){
            this.setState({scanned:false});
            return
        }
        let string_qr = "http://qrcodes.smoove.pro/qrcode/FP_"
        let string_qr_sub = "http://qrcodes.smoove.pro/qrcode/"
        if (data.substring(0,string_qr.length) != string_qr){
            
            if (data.substring(0,string_qr_sub.length) != string_qr_sub){
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Le QR Code de ce Vélib n\'est pas à jour',
                    text2: 'Merci Smovengo :-)',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40
                  });
            }else{
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Ce n\'est pas un QR Vélib',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40
              });
            }
            sleep(5000).then(() => this.setState({scanned:false}));
            return
        }
        let qr = data.substring(string_qr.length,string_qr.length+5);
        sleep(5000).then(() => this.setState({scanned:false}));
        this.setState({idVelib:undefined});
        Location.getCurrentPositionAsync({}).then(
            (location) => { 
            let user_pos = {
              latitude:location.coords.latitude,
              longitude:location.coords.longitude};
            let stations = this.state.stations;
            let closest = closest_station(user_pos, stations);
            closest = closest[0];
            this.props.navigation.navigate('Report',{bikeId:parseInt(qr),closest:closest});
            }).catch((err) => {
                this.props.navigation.navigate('Report',{bikeId:parseInt(qr),closest:undefined});
            });
      };
    

    render(){


        if (this.state.permission == undefined){
            return <View style={styles.container}><Text>Accorder permission caméra</Text></View>
        }else if (this.state.permission == false){
            return <View style={styles.container}><Text>Pas d'accès caméra</Text></View>

        }

        return (
            <View style={styles.container}>
            <StatusBar hidden={true} />
              <BarCodeScanner
                onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                style={{position:"absolute",height:height,width:width}}
              />
            <View style={styles.topText}>
                <Text style={styles.textScanQR}>Scannez le QR Code</Text>
            </View>
            {this.state.idVelib.length < 4 &&
            <View style={styles.decoCamera}>
               
            </View>
            }
            {this.state.idVelib.length >= 4 &&
            <TouchableOpacity style={styles.goButton}
            onPress={() =>  this.props.navigation.navigate('Report',{bikeId:this.state.idVelib, from:'Map'})}
            >
               <Text style={styles.goText}>
                   GO !
               </Text>
            </TouchableOpacity>
            }
            <TextInput
            style={styles.inputId}
            placeholder={"Ou entrez l'ID du Vélib"}
            placeholderTextColor={"rgba(255,255,255,0.6)"}
            keyboardType="number-pad"
            maxLength={6}
            value={this.state.idVelib}
            onChangeText={(text) => this.setState({"idVelib":text})}>

            </TextInput>
              
            </View>
          );

    }

}


const styles = StyleSheet.create({
    container:
    {
    flex:1,
    alignItems:"center",
    justifyContent:"center"
    },
    decoCamera:
    {
    width:250,
    height:250,
    borderColor:"white",
    borderWidth:5,
    },
    goButton:
    {
    width:250,
    height:250,
    borderColor:"white",
    borderWidth:5,
    backgroundColor:"rgba(81, 207, 78,0.8)",
    alignItems:"center",
    justifyContent:"center"
    },
    goText:{
        fontSize:40,
        color:"white",
        fontWeight:"bold"
    },
    textScanQR:{
        color:"white",
        fontSize:25,
        
    },
    inputId:{
        width:250,
        backgroundColor:"rgba(0,0,0,0.5)",
        marginTop:10,
        padding:10,
        textAlign:"center",
        fontSize:18,
        color:"white",
        

    },
    topText:{
        width:250,
        backgroundColor:"rgba(0,0,0,0.5)",
        marginBottom:10,
        padding:5,
        alignItems:"center",
        justifyContent:"center"
    }
    
})