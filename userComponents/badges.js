import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, StatusBar, ScrollView, TouchableHighlight} from 'react-native';
import MapView, { Circle } from 'react-native-maps';

import {Loading} from '../components/loading'
import {getItemValue} from '../utils/storage'

import {getStats} from '../utils/stats'
import {compute_badges, compute_events, compute_mesures, compute_voyages} from '../utils/badgeFunctions'

const { width, height } = Dimensions.get("window");


class BadgeItem extends React.Component{

    render(){
        let kind =this.props.kind;
        let opacity = 1;
        let blurRadius = 0;
        let backgroundColor = "white";
        let f_on_press = () => this.props.parent.setState({activeBadge:this.props.index, kind:kind});; 
        let underlay = "#1e305c";
        if (kind == "blurred"){
            opacity = 0.4;
            blurRadius = 5; 
            backgroundColor = "#534780";  
            underlay = "";      
            f_on_press = () => {};
        }else if(kind == "voyage"){
            backgroundColor = "#c2caed";   
            
        }else if(kind == "badge"){
            let level = this.props.level;
            f_on_press = () => this.props.parent.setState({activeBadge:{"badge":this.props.index,"level":level}, kind:kind});
            if (level == 0){
                backgroundColor = "rgba(238, 245, 142, 0.2)";   
            } else if (level == 1){
                backgroundColor = "rgba(238, 245, 142, 0.5)";
            }else if(level == 2){
                backgroundColor = "rgba(238, 245, 142, 1)"; 
            }
        }else if(kind == "event"){
            backgroundColor = "#add9db";   
        }
        return (
            <TouchableHighlight 
            style={[styles.badgeIcon,{backgroundColor:backgroundColor, opacity:0.8}]}
            onPress={f_on_press}
            underlayColor={underlay}
            >
                {this.props.index.Pic != undefined &&
                <View>
                <Image
                    style={[styles.badgeImage,{ tintColor: 'gray' }]}
                    source={{uri:'http://theo.delemazure.fr/bivelAPI/badges/'+this.props.index.Pic}}
                />
                <Image
                    style={[styles.badgeImage,{ position: 'absolute', opacity: opacity}]}
                    blurRadius={blurRadius}
                    source={{uri:'http://theo.delemazure.fr/bivelAPI/badges/'+this.props.index.Pic}}
                />
                </View>
                }
               
            </TouchableHighlight>
        )
    }
}



export default class BadgeView extends React.Component{

    state={
        ridesInfos:undefined,
        paymentsInfos:undefined,
        userInfos:undefined,
        badges:undefined,
        event:undefined,
        voyages:undefined,
        activeBadge:undefined,
        kind:undefined,
        scrollLayer:0
    };
    
    componentDidMount() {
        getItemValue("@rides_infos").then((res) => this.setState({ridesInfos:JSON.parse(res)}));   
        getItemValue("@payments_infos").then((res) => this.setState({paymentsInfos:JSON.parse(res)}));   
        getItemValue("@user_infos").then((res) => this.setState({userInfos:JSON.parse(res)}));
        this.setState({badges:require('../json/badges.json')});
        this.setState({event:require('../json/event.json')});
        this.setState({voyages:require('../json/voyages.json')});
    }



    render (){
        
        if (this.state.ridesInfos == undefined || this.state.userInfos == undefined|| this.state.paymentsInfos == undefined){
            return <Loading/>
        }
        
        let rides = this.state.ridesInfos;
        let infosDists = getStats(rides);
        let mesures = compute_mesures(rides, this.state.userInfos['generalDetails']['customerDetails']['birthDate']);
        let voyage_max = compute_voyages(mesures, this.state.voyages);
        let badges_list =compute_badges(mesures, this.state.badges);
        let badges_obtained = badges_list.obtained;
        let badges_blurred = badges_list.not_obtained;
        let event_list =compute_events(rides, this.state.event);
    
        let description;
        let titre;
        if (this.state.kind != undefined){
            if (this.state.kind == "badge"){
                let level = this.state.activeBadge.level;
                let descs = this.state.activeBadge.badge.Descriptions;
                level = descs.length+level-3;
                description = descs[level].Description;
                titre = this.state.activeBadge.badge.Titre;
            }else if(this.state.kind == "event"){
                description = this.state.activeBadge.Description;
                titre = this.state.activeBadge.Titre;
            }else if(this.state.kind == "voyage"){
                description = "Félicitation ! Vous avez parcouru plus de "
                    +this.state.activeBadge.Dist
                    +" km, soit la distance en vol d'oiseau entre Paris et "
                    +this.state.activeBadge.Ville
                    +", "
                    +this.state.activeBadge.Pays
                    +" !";
                titre = this.state.activeBadge.Ville
                    +" ("
                    +this.state.activeBadge.Dist
                    +" km)";
            }
        }
        let nArray = [];
        for (let i =0;i < 3; i++){
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer/width-1/2) <= i && (this.state.scrollLayer/width+1/2)> i){
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }
        return (<View
                style={styles.container}>
                <StatusBar hidden={true} />
            <View style={styles.topView}>
                    <Text style={styles.pseudo}>Badges</Text>
            </View>
                <ScrollView 
                    snapToInterval={width}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    style={{flex:1, width:width}}
                    onScroll={(e) => this.setState({"scrollLayer":e.nativeEvent.contentOffset.x})}
                    horizontal>
                
                <ScrollView 
                style={{width:width}}
                showsVerticalScrollIndicator={false}
                >
                <View style={styles.titleContainer}>
                    <Text  style={styles.titleText}>
                        Accomplissements
                    </Text>
                </View>
                <View style={styles.badgeContainer}>
                    { badges_obtained.map(index => <BadgeItem parent={this} 
                    index={this.state.badges[index.id]}
                    level = {index.level} 
                    kind="badge"/> )}
                    { badges_blurred.map(index => <BadgeItem parent={this} 
                    index={this.state.badges[index]}
                    kind="blurred"/> )}
                </View>
            </ScrollView>

            <ScrollView 
                style={{width:width}}
                showsVerticalScrollIndicator={false}
                >
                <View style={styles.titleContainer}>
                    <Text  style={styles.titleText}>
                        Carnet de Voyages
                    </Text>
                </View>
                <MapView 
                minZoomLevel = {0}
                style={{marginHorizontal:20, height:150}}
                initialRegion={{
                  latitude:48.864716,
                  longitude:2.349014,
                  latitudeDelta: infosDists.total/50,
                  longitudeDelta: infosDists.total/50,
                }}>
                        <Circle
                        center={{
                            latitude:48.864716,
                            longitude:2.349014}} 
                        radius={infosDists.total*1000}
                        fillColor="rgba(150,50,50,0.3)"
                        strokeColor="rgba(150,50,50,0.8)"
                        strokeWidth={5}
                        />
                </MapView>
                <View style={styles.badgeContainer}>
                    {this.state.voyages.slice(0,voyage_max).map(index => <BadgeItem parent={this} index={index} kind="voyage"/>)}
                    <BadgeItem parent={this} index={this.state.voyages[voyage_max]} kind="blurred"/>
                </View>
                </ScrollView>


                <ScrollView 
                style={{width:width}}
                showsVerticalScrollIndicator={false}
                >
                <View style={styles.titleContainer}>
                    <Text  style={styles.titleText}>
                        Evenements
                    </Text>
                </View>
                <View style={styles.badgeContainer}>
                    { event_list.map(index => <BadgeItem parent={this} index={this.state.event[index]} kind="event"/> )}
                </View>
            </ScrollView>
        </ScrollView>
        {(this.state.activeBadge != undefined) &&
        <View
        style={styles.whiteOverlay}>
            
        <TouchableHighlight 
        style={styles.TouchableOverlay}
        onPress={() => this.setState({activeBadge:undefined, kind:undefined})}
        activeOpacity={1}
        underlayColor="">
            <View
            style={styles.messageBadge}>
                <Text style={styles.badgeTitle}>
                    {titre}
                </Text>
                <Text style={styles.badgeDesc}>
                    {description}
                </Text>
            </View>
         </TouchableHighlight>
        </View>
        }
        <View style={styles.bottomView}>
                        {nArray.map((whatWePush) => {return(
                        <View style={[styles.bottomDot,{backgroundColor:whatWePush}]}>
                            <Text></Text>
                        </View>)
                        })}
                    </View>
        </View>);
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgb(40, 62, 105)"
        },
    badgeContainer:{
        flexDirection:"row",
        justifyContent:"center",
        flexWrap:"wrap",
        alignItems:"center"
    },
    titleContainer:{
        alignItems:"center",
        justifyContent:"center",
        padding:5
    },
    badgeIcon:{
        width:90,
        height:90,
        margin:10,
        borderRadius:50,
        alignItems:"center",
        justifyContent:"center"
    },
    badgeImage:{
        width:80,
        height:80,
        borderRadius:40
    },
    whiteOverlay:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        opacity:0.8,
        backgroundColor:"#d0dbf7",
        alignItems:"stretch",
        justifyContent:"center"
    },
    TouchableOverlay:{
        height:height,
        alignItems:"stretch",
        justifyContent:"center"
    },
    messageBadge:{
        margin:15,
        backgroundColor:"rgb(34, 49, 87)",
        alignItems:"center",
        padding:20
    },
    badgeTitle:{
        margin:2,
        fontSize:22,
        fontWeight:'bold',
        color:"#ddd"
    },
    badgeDesc:{
        margin:1,
        fontSize:16,
        textAlign:"center",
        color:"#ddd"
    },
    divider:{
        marginTop:10,
        marginBottom:10,
        backgroundColor:"#000",
        height:3,
        width:width-30
    },topView:{
        padding:15,
        backgroundColor:"rgb(25, 41, 71)",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"stretch",
      },    
      pseudo:{
          fontSize:30,
          fontWeight:'700',
          color:"#d8deeb"
      
      },titleText:{
          fontSize:25,
        color:"#ddd",
    fontWeight:"bold"},
    bottomView:{
        position:"absolute",
        bottom:0,
        paddingBottom:10,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        width:width,
    },
    bottomDot:{
        width:10,
        height:10, 
        borderRadius:10,
        margin:5
    },
});