import * as React from 'react';
import { Text, View, StyleSheet, Dimensions,ScrollView, StatusBar} from 'react-native';

import {Loading} from './loading'
import {getItemValue} from '../api/storage'

import {getStats} from '../rides_functions/stats'
import {Night, Speed, DistOneDay, CumulDist,
        DistRides,  HourDist,  DayDist, MonthDist} from './charts_panels'

const { width, height } = Dimensions.get("window");


const TableItem  = (params) =>  {
    return (
        <View style={[styles.tableInfos,{backgroundColor:params.color}]}>
            <View style={[styles.tableInfosItem]}>
                <Text style={styles.tableInfosText}>
                    {params.text}
                </Text>
            </View>
            <View style={styles.tableInfosItem}>
                <Text style={styles.tableInfosValue}>
                    {params.value}
                </Text>
            </View>
        </View>
    )
}


const style_panel ={width:width,flex:1};

export default class StatsView extends React.Component{

    state={
        ridesInfos:undefined,
        paymentsInfos:undefined,
        userInfos:undefined,
        scrollLayer:0
    };
    
    componentDidMount() {
        getItemValue("@rides_infos").then((res) => this.setState({ridesInfos:JSON.parse(res)}));   
        getItemValue("@user_infos").then((res) => this.setState({userInfos:JSON.parse(res)}));
        getItemValue("@payments_infos").then((res) => this.setState({paymentsInfos:JSON.parse(res)}));
    }


   
    render() {

        if (this.state.ridesInfos == undefined || this.state.userInfos == undefined|| this.state.paymentsInfos == undefined){
            return (
            <Loading/>
            )
        }

        const name = this.state.userInfos['generalDetails']['customerDetails']['name']['firstName']
                + " "
                + this.state.userInfos['generalDetails']['customerDetails']['name']['lastName']

        let abonnement;
        if (this.state.userInfos['subscriptions'] != undefined){
            abonnement = "Abonnement : "
            + this.state.userInfos['subscriptions']['title'];
        }else{
            abonnement = "Pas d'abonnement en cours"
        }

        let rides = this.state.ridesInfos;
        let totalMoney = this.state.paymentsInfos;
        let infosDists = getStats(rides);

        let nArray = [];
        for (let i =0;i < 9; i++){
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer/width-1/2) <= i && (this.state.scrollLayer/width+1/2)> i){
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }

        return (
                <View style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.topView}>
                    <Text style={styles.pseudo}>Statistiques</Text>
                </View>
                <ScrollView
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={{flex:1, width:width}}
                onScroll={(e) => this.setState({"scrollLayer":e.nativeEvent.contentOffset.x})}
                horizontal>
                    <View style={style_panel}>
                        <View style={{ flex:1, padding: 20, alignItems:"stretch" }}>
                        <View style={{justifyContent:"center",  marginBottom: 10}}>
                            <Text style={{fontSize:20, textAlign:"center",color:"#ddd"}}>
                                Statistiques
                                <Text style={{color:'rgba(99, 230, 219,0.7)', fontWeight:"bold"}}> Générales</Text>.
                            </Text>
                        </View>
                    {TableItem({
                        color:"rgba(99, 230, 219,0.7)",
                        text:"Distance totale",
                        value:Math.round(1000*infosDists.total)/1000 + " km"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.5)",
                        text:"Distance en Electrique",
                        value:Math.round(1000*infosDists.totalElec)/1000 + " km"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.7)",
                        text:"Distance en Mécanique",
                        value:Math.round(1000*infosDists.totalMeca)/1000 + " km"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.5)",
                        text:"Distance ce mois",
                        value:Math.round(1000*infosDists.totalMonth)/1000 + " km"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.7)",
                        text:"CO2 économisé",
                        value:Math.round(infosDists.total*111)/1000 + " kg"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.5)",
                        text:"Temps total",
                        value:Math.floor(infosDists.totalTime/3600) + " h " + Math.floor((infosDists.totalTime%3600)/60) + " m "})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.7)",
                        text:"Plus long voyage",
                        value:Math.round(1000*infosDists.longest)/1000 + " km"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.5)",
                        text:"Argent dépensé",
                        value:Math.round(100*totalMoney)/100 + " €"})}
                    {TableItem({
                        color:"rgba(99, 230, 219,0.7)",
                        text:"Prix/km",
                        value:Math.round(100*totalMoney/infosDists.total)/100+ " €/km"})}
                            </View>
                        </View>
                        <View style={style_panel}>
                            <CumulDist rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <MonthDist rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <DistRides rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <Speed rides={rides}/>
                        </View>        
                        <View style={style_panel}>
                            <HourDist rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <DayDist rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <DistOneDay rides={rides}/>
                        </View>
                        <View style={style_panel}>
                            <Night rides={rides}/>
                        </View>
                    </ScrollView>
                <View style={styles.bottomView}>
                        {nArray.map((whatWePush) => {return(
                        <View style={[styles.bottomDot,{backgroundColor:whatWePush}]}>
                            <Text></Text>
                        </View>)
                        })}
                </View>
                </View>
        )
    }
}




const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        height:height,
        backgroundColor:"rgb(40, 62, 105)"
    },
    divider:{
        marginTop:10,
        marginBottom:0,
        backgroundColor:"#000",
        height:3,
        width:width-30
    },
    tableInfos:{
        flexDirection:"row",
        
    },
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
    tableInfosItem:{
        flex:1,
        padding:10,
        alignItems:"center",
        justifyContent:"center"
    },
    tableInfosText:{
        fontSize:16,
        fontWeight:"bold",
        textAlign:"center"
    },
    tableInfosValue:{
        fontSize:16
    }, topView:{
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
      
      },

});



