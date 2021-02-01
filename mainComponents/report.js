import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, StatusBar, ScrollView} from "react-native";
import { Icon } from 'react-native-elements';

import {fileReport} from '../api/reportVelib';
import {getItemValue} from '../utils/storage';

const { width, height } = Dimensions.get("window");





export default class SignalScreen extends React.Component{

    state={
        error:require('./json/report.json'),
        currentError:undefined,
        bikeId:this.props.route.params.bikeId,
        user:undefined,
        success:"Rapport en cours d'envoi...",
        bivelId:undefined,
        from:this.props.route.params.from,
        closest:this.props.route.params.closest,
    }

    sendReport(e){
        this.scrollLayer.scrollTo({x:2*width})
        let user ={
            "id":this.state.user['generalDetails']['customerInternalCode'],
            "email":this.state.user['generalDetails']['customerDetails']['contactDetails']['email'],
            "firstname":this.state.user['generalDetails']['customerDetails']['name']['firstName'],
            "lastname":this.state.user['generalDetails']['customerDetails']['name']['lastName'],
        }

        fileReport(this.state.bikeId,user,  e, this.state.bivelId, this.state.closest).then((res) =>
        this.setState({success:"Rapport envoyé avec succès !"}))
        .catch(() => {this.setState({success:"Erreur dans l'envoi du rapport."})})
        
    }
   
    componentDidMount(){
        getItemValue("@bivel_infos").then((res) => this.setState({bivelId:JSON.parse(res).id})); 
        getItemValue("@user_infos").then((res) => this.setState({user:JSON.parse(res)})); 
      
    }

    goback(){
        if (this.state.from == "Home"){
            this.props.navigation.goBack();
        }else{
            this.props.navigation.navigate('Map');
        }
    }
    render() {
        let xtab = []
            if (this.state.currentError != undefined){
                xtab = this.state.currentError['subIssues'];
            }
            return <View style={styles.container}>
            <StatusBar hidden={true} />
                <View style={{alignItems:"center"}}>
                    <Text style={styles.titleReport}>Signalement Vélib</Text>
                    <Text > {"#"+this.state.bikeId}</Text>
                    </View>
                    <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    ref={(node) => this.scrollLayer = node}
                    >
                        <View style={styles.containerBoxes}>
                {this.state.error.map((e) => 
                <TouchableOpacity 
                onPress={() => {this.setState({currentError:e});this.scrollLayer.scrollTo({x:width})}}>
                
                    <View style={styles.boxError1}>
                <Image
                    style={styles.imageError}
                    source={{uri:'http://theo.delemazure.fr/bivelAPI/reports/'+e.pic}}
                />
                    <Text style={{fontWeight:'bold'}}>{e.name}</Text></View></TouchableOpacity>)}
            </View>
            <View style={styles.containerBoxes}>
                <TouchableOpacity
                onPress={() =>  {this.setState({currentError:undefined});this.scrollLayer.scrollTo({x:0})}}
                underlayColor=''
                >
            <View style={[styles.boxError2,
                {borderColor:'rgba(212, 49, 0,0.3)',
                backgroundColor:'rgba(212, 49, 0,0.1)',
                flexDirection:'row',
                marginRight:30}]}>
                
            <Icon name='arrow-left' 
                        type='material-community'
                        color="rgb(212, 49, 0)" 
                        size={20} 
                        marginRight={10} />
                <Text style={{textAlign:"center",color:'rgba(212, 49, 0,1)'}}>Retour</Text>
                </View>
                </TouchableOpacity>
            {this.state.currentError != undefined &&
             
            xtab.map((e) => {return (<TouchableOpacity
                onPress={() => this.sendReport(e)}>
                <View style={styles.boxError2}>
                <Text style={{textAlign:"center"}}>{e.name}</Text>
                </View>
                </TouchableOpacity>)})
            }
            </View>
            <View style={styles.displayMessage}>
                <View style={styles.reportMessage}>
                <Text style={{fontSize:25}}>
                    {this.state.success}
                </Text>
                </View>
                <View style={styles.containerBoxes}>
                        <TouchableOpacity 
                        onPress={() => this.goback()}
                        underlayColor=''
                        >
                        <View style={[styles.boxError2,
                                        {borderColor:'rgba(212, 49, 0,0.3)',
                                        backgroundColor:'rgba(212, 49, 0,0.1)',
                                        flexDirection:'row',
                                        marginRight:30}]}>
                                        
                                    <Icon name='arrow-left' 
                                                type='material-community'
                                                color="rgb(212, 49, 0)" 
                                                size={20} 
                                                marginRight={10} />
                            <Text style={{textAlign:"center",color:'rgba(212, 49, 0,1)'}}>Retour</Text>
                         </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate ('QR')}
                        underlayColor=''
                        >
                             <View style={[styles.boxError2,
                            {borderColor:'rgba(66, 109, 158,0.3)',
                            backgroundColor:'rgba(66, 109, 158,0.1)',
                            flexDirection:'row',
                            marginRight:30}]}>
                            
                            <Icon name='cached' 
                                        type='material-community'
                                        color="rgb(66, 109, 158)" 
                                        size={20} 
                                        marginRight={10} />
                                <Text style={{textAlign:"center",color:'rgba(66, 109, 158,1)'}}>
                                    Scanner un autre Vélib'
                                </Text>
                                </View>
                        </TouchableOpacity>
                    </View>
            </View>
            </ScrollView>
            </View>


    }


}

const styles = StyleSheet.create({
    container:{
        marginTop:10,
        alignItems:"center"
    },
    containerBoxes:{
        flexWrap:'wrap',
        flexDirection:'row',
        margin:10,
        width:width-20
    },
    reportMessage:{
        alignItems:"center",
    },
    displayMessage:{
        alignItems:"stretch",
        justifyContent:"center",
        flexDirection:"column",
        margin:10,
        width:width-20,
    },
    boxError1:{
        width:width/2-20,
        borderWidth:3,
        borderColor:"#ddd",
        backgroundColor:"#eeeeee",
        margin:5,
        height:height/4-40,
        padding:10,
        alignItems:"center"
    },
    boxError2:{
        width:width-40,
        borderWidth:3,
        borderColor:"#ddd",
        backgroundColor:"#eeeeee",
        margin:5,
        padding:10,
        alignItems:"center",
        justifyContent:"center"
    },
    titleReport:{
        fontWeight:'bold',
        fontSize:20

    },
    imageError:{
        width:(height/4-40)*0.7,
        height:(height/4-40)*0.7,
        borderRadius:(height/4-40)*0.35,
        borderWidth:2,
        borderColor:"#999"
    }
    });