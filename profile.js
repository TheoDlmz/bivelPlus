
import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput,StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import Toast from 'react-native-toast-message';

import {getItemValue} from './api/storage'
import {deconnect} from './api/connect'
import {connect} from './api/connect'

import {getStats} from './rides_functions/stats'

const { width, height } = Dimensions.get("window");


export default class AccountView extends React.Component{

    state={
        ridesInfos:undefined,
        userInfos:undefined,
        logged:true,
        email:"",
        password:"",
    }

    loadData(){
        getItemValue("@rides_infos").then((res) => this.setState({ridesInfos:JSON.parse(res)}))
        .catch((err) => this.setState({logged:false}));   
        getItemValue("@user_infos").then((res) => this.setState({userInfos:JSON.parse(res)}))
        .catch((err) => this.setState({logged:false}));   

    }

    backToLogin(){
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
    }


    async fetchData(last_update){

        let d = new Date();
        let curr_date = d.toDateString();
        if (last_update == undefined){
           this.backToLogin();
           return
        }
        if (curr_date != last_update){
            let email = await getItemValue("@username");
            let password = await getItemValue("@password");
            connect(email, password, true).then(async (res) => {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Infos Updated',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40
                  });
              })
              .catch((err) => Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Failed to update your data',
                text2: err.message,
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40
              })
              
              );
        }
    }

    componentDidMount() {
        getItemValue("@last_update").then((res) => this.fetchData(res)).catch((res) =>
        this.backToLogin());
        this.loadData();
    }


    async updateData(){
        Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Téléchargement des données en cours',
            text2: 'Cela devrait prendre quelques secondes',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          });
        let email = await getItemValue("@username");
        let password = await getItemValue("@password");
        connect(email, password, true).then(async (res) => {
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Infos Updated',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40
              });
              
            this.loadData();
          })
          .catch((err) => Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Failed to update Infos',
            text2: err.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          })
          
          );

    }

    deconnectUser(){
        deconnect().then((res) => {
            Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Successfully deconnected',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          });
          this.setState({logged:false})
          console.log("deconnected")
        
        })
      .catch((err) => Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Failed to deconnect',
        text2: err.message,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40
      })
      
      );


    }

    connectUser =  async () => {
        Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Connexion en cours',
            text2: 'Cela devrait prendre quelques secondes',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          });
        connect(this.state.email,this.state.password, true)
          .then(async (res) => {
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Connecté avec succès',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40
              });
              this.setState({logged:true})
                this.loadData();
          })
          .catch((err) => Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Erreur lors de la connection',
            text2: err.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          })
          
          );
      }

    RideItem(params){

        let color = "#d0f086";
        let elec = params.r.elec;
        let date = new Date(params.r.date);
        if (params.r.dist < 100){
            color = "#dea38a";
        }else if(elec){
            color = "#8ac6de";
        }
        let timefin = new Date(date.getTime()+ params.r.duration*1000);
    
        return (
            <View style={[styles.rideBloc,{backgroundColor:color}]} >
                <View
                    style={[styles.rideSubBloc,{justifyContent:'space-between',padding:0}]}
                >
                    <View style={styles.rideSubBloc}>
                        <Icon name='calendar'
                            type='material-community'
                            style={{marginRight:5}}
                            size={20} />
                        <Text>
                            {date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()}
                        </Text>
                    </View>
                    {params.r.elec &&
                        <Icon name='flash'
                            type='material-community'
                            style={{paddingTop:2}}
                            size={20} />
                    }
                </View>
                <View style={styles.rideSubBloc}>
                    <Icon name='clock'
                        type='material-community'
                        style={{marginRight:5}}
                        size={20} />
                    <Text>
                        {String(date.getHours()).padStart(2, "0")
                        +'h'
                        +String(date.getMinutes()).padStart(2, "0") 
                        + " - "
                        + String(timefin.getHours()).padStart(2, "0")
                        +'h'
                        + String(timefin.getMinutes()).padStart(2, "0") 
                        }
                    </Text>
                </View>
                <View style={styles.rideSubBloc}>
                    <Icon name='bike'
                        type='material-community'
                        style={{marginRight:5}}
                        size={20} />
                    <Text>
                        {params.r.dist/1000 + " km"}
                    </Text>
                </View>
            </View>
        )
    }



    render() {



        if (!this.state.logged){

            return <View style={styles.containerLogin}>
                    <TextInput
                    style={styles.input}
                    placeholder="email adress"
                    keyboardType="email-address"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                />
                    <TextInput
                    style={styles.input}
                    placeholder="password"
                    autoCapitalize = 'none'
                    secureTextEntry={true}
                    maxLength={20}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    />
                    <TouchableOpacity
                        onPress={() => this.connectUser()}
                        style={styles.buttonLogin}
                    >
                    <Text style={styles.buttonText}>
                        Se connecter</Text>
                        </TouchableOpacity>
       
          </View>


        }
        let name;
        let score;
        let n = 0;
        let indexs = [];
        let rides;
        if (this.state.userInfos == undefined || this.state.ridesInfos == undefined){
            name = "Loading...";
            score = "Loading...";
        }else{
            name = this.state.userInfos['generalDetails']['customerDetails']['name']['firstName']
                + " "
                + this.state.userInfos['generalDetails']['customerDetails']['name']['lastName'][0] +".";

            rides = this.state.ridesInfos;
            let infosDists = getStats(rides);
            score = Math.round(infosDists.total)+ " km";
            
            n = Math.min(20,rides.length);

            indexs = [...Array(n).keys()];;
        }

        return <View style={styles.container}>
        <StatusBar hidden={true} />
            <View style={styles.topView}>
            <View style={styles.topLeft}>
                <TouchableOpacity
                underlayColor=""
                  onPress={() =>
                    this.props.navigation.navigate ('Map')} >
                <Icon name='map' 
                        type='material-community'
                        color="#d8deeb" 
                        size={42}  />
                  
                  </TouchableOpacity>
                  <Text style={styles.mapText}>
                  Map
                </Text>
                </View>
                <View style={styles.middleTop}>
                  
                    <Text style={styles.pseudo}>{name}</Text>
                  <Text style={{letterSpacing:2, color:"#d8deeb"}}>{score}</Text>
                </View>
                <View
                style={styles.rightTop}>
                  <TouchableOpacity
                onPress={() => this.updateData()}
                underlayColor="" >
                <Icon name='update' 
                        type='material-community'
                        color="#d8deeb" 
                        size={42}  />
                  </TouchableOpacity>
                <Text style={styles.updateText}>
                    Update
                </Text>
            </View>

            </View>

            <ScrollView
                    style={styles.lastRides}
                    snapToInterval={160}
                    horizontal>
                        {indexs.map(index => this.RideItem({r:rides[index]}))}
            </ScrollView>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('Rides')} >
                    <Icon name='bike' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Trajets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('MapRides')} >
                    <Icon name='map-marker-circle' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Carte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('Stats')} >
                    <Icon name='finance' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Statistiques</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('Badges')} >
                <Icon name='star-circle' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Badges</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('UserReports')} >
                <Icon name='alert-circle' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Signalement</Text>
                </TouchableOpacity>
               
                <TouchableOpacity style={styles.oneButton}
                  onPress={() =>
                    this.props.navigation.navigate ('Ranking')} >
                <Icon name='podium' 
                        type='material-community'
                        color="white" 
                        size={45} />
                    <Text style={styles.textButton}>Classement</Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity style={styles.logOutButton}
                onPress={() => this.deconnectUser()}>
                    <Text style={styles.textButton}>Deconnexion</Text>
                </TouchableOpacity>
        </View>

    }




}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        backgroundColor:"rgb(40, 62, 105)"
    },
    topView:{
        height:80,
        backgroundColor:"rgb(25, 41, 71)",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingRight:5,
        paddingLeft:5,
        alignSelf:"stretch",
    },
    middleTop:{
        alignItems:"center",
        justifyContent:"center"
      },
      rightTop:{
        width:60,
        alignItems:"center",
        justifyContent:"center"
  
      },
      mapText:{
        marginTop:-4,
        fontWeight:"bold",
        color:'#d8deeb'
      },
      updateText:{
        marginTop:-4,
        fontWeight:"bold",
        color:'#d8deeb'
      },
      topLeft:{
      width:60,
      alignItems:"center",
      justifyContent:"center"
    },
    pseudo:{
        fontSize:30,
        fontWeight:'700',
        color:"#d8deeb"
    
    },
    lastRides:{
        flexDirection:'row',
        margin:5,
        marginTop:10,
        flex:1
    },
    rideBloc:{
        width:150,
        margin:5,
        alignItems:"stretch"
    },
    rideSubBloc:{
        flexDirection:'row',
        padding:5,
    },
    
    divider:{
        marginTop:10,
        marginBottom:10,
        backgroundColor:"#FFF",
        height:3,
        width:width-30
    },
    buttonView:{
        flex:3.8,
        margin:5,
        flexWrap:'wrap',
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    oneButton:{
        width:0.45*width,
        height:0.16*height,
        backgroundColor:"rgb(25, 41, 71)",
        margin:5,
        alignItems:"center",
        justifyContent:"center"
    },
    logOutButton:{
        position:"absolute",
        bottom:0,
        width:width,
        padding:10,
        backgroundColor:"rgb(209, 68, 52)",
        alignItems:"center",
        justifyContent:"center"
    },
    textButton:{
        fontSize:17,
        color:"white",
        fontWeight:"bold"
    }, 
    containerLogin:{
        flex: 1, 
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor:'rgb(29, 32, 59)',
         padding:40, 
       paddingTop:120,


     },
    input: {
        backgroundColor:'#dae4f5',
        fontSize:18,
        padding:10,
        marginBottom:10,
        borderRadius:50,
        paddingLeft:20,
        paddingRight:20
        
      },
      buttonLogin:{
        backgroundColor:'#eb801c',
        padding:8,
        marginTop:20,
        paddingLeft:20,
        paddingRight:20,
        alignItems:"center",
      },buttonText:{
        color:'white',
        fontSize:19,
        fontWeight:'bold'
      },
})