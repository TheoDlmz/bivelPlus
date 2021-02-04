
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, Dimensions} from 'react-native';
import Toast from 'react-native-toast-message';

import {Loading} from '../components/loading'
import {getItemValue} from '../utils/storage'
import {fetchRanking} from '../api/getRankings'

const { width, height } = Dimensions.get("window");



export default class RankingView extends React.Component{

    state={
        userInfos:undefined,
        ranking:undefined,
        scrollLayer:0
    };
    
    getRanking(){
        fetchRanking().then((res) => this.setState({ranking:JSON.parse(res.data)})).catch((err) => Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Failed to fetch ranking',
            text2: err.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40
          }));
    }
    componentDidMount() {
        getItemValue("@user_infos").then((res) => this.setState({userInfos:JSON.parse(res)}));   
        this.getRanking();
      }


      RankingBloc(params){
        let opacity;
        if (params.rank%2 == 0){
            opacity = 0.8;
        }else{
            opacity = 0.4;
        }
        return (
            <View style={[styles.blockranking,{backgroundColor:`rgba(23, 12, 54,${opacity})`}]}>
                <View style={styles.rank}>
                    <Text style={styles.rankTxt}>
                        {params.rank}
                    </Text>
                </View>
                <View style={styles.pseudo}>
                    <Text style={styles.pseudoTxt}>
                        {params.pseudo}
                    </Text>
                </View>
                <View style={styles.score}>
                    <Text style={styles.scoreTxt}>
                        {params.dist+" km"} 
                    </Text>
                </View>
            </View>
        )
    }
    render() {
        if (this.state.userInfos == undefined || this.state.ranking == undefined){
            return <Loading/>
        }

        let nArray = [];
        
        for (let i =0;i < 3; i++){
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
                    <Text style={styles.title}>Classement</Text>
            </View>
            <ScrollView 
                    snapToInterval={width}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    style={{flex:1, width:width}}
                    onScroll={(e) => this.setState({"scrollLayer":e.nativeEvent.contentOffset.x})}
                    horizontal>
            <View style={{width:width}}>
                <View style={styles.titreRanking}>
                    <Text style={styles.titreText}>
                        Distance totale
                    </Text>
                </View>
                <ScrollView style={styles.ranking}>
                    
                    {this.state.ranking.total.map(item => this.RankingBloc({rank:item.rank, pseudo: item.pseudo, dist:item.score}))}
                
                </ScrollView>
            </View>
            <View style={{width:width}}>
                <View style={styles.titreRanking}>
                    <Text style={styles.titreText}>
                        Distance mécanique
                    </Text>
                </View>
                <ScrollView style={styles.ranking}>
                    
                    {this.state.ranking.totalMeca.map(item => this.RankingBloc({rank:item.rank, pseudo: item.pseudo, dist:item.score}))}
                
                </ScrollView>
            </View>
            <View style={{width:width}}>
                <View style={styles.titreRanking}>
                    <Text style={styles.titreText}>
                        Distance ce mois-ci
                    </Text>
                </View>
                <ScrollView style={styles.ranking}>
                    
                    {this.state.ranking.month.map(item => this.RankingBloc({rank:item.rank, pseudo: item.pseudo, dist:item.score}))}
                
                </ScrollView>
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
        justifyContent:"center",
        alignItems:"stretch",
        backgroundColor:"rgb(40, 62, 105)"
        },
    blockranking:{
        height:40,
        flexDirection:"row"
    },ranking:{
        padding:5,
        margin:20
    },pseudo:{
        flex:0.6,
        padding:10,
        justifyContent:"center"
    },pseudoTxt:{
        fontSize:18,
        fontWeight:"bold",
        color:"#ddd"
    },score:{
        flex:0.35,
        padding:10,
        justifyContent:"center",
        alignItems:"flex-end"
    },scoreTxt:{
        fontSize:18,
        color:"#ddd"

    },rank:{
        backgroundColor:"rgba(23, 12, 54, 0.6)",
        flex:0.05,
        padding:10,
        justifyContent:"center"

    }, rankTxt:{
        fontSize:18,
        fontWeight:"bold",
        color:"#ddd"

    }, winners:{
        flexDirection:'row',
        justifyContent:"space-around",
        alignItems:"center",
        marginBottom:10
    },winnerBloc:{
        padding:10,
        width:width/3,
        alignItems:"center",
        justifyContent:"center",
    },winnerTxt:{
        fontSize:16,
        fontWeight:'bold',
        color:"#ddd"
    },winnerScore:{
        fontSize:12,
        color:"#ddd"
    },topView:{
        padding:15,
        backgroundColor:"rgb(25, 41, 71)",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"stretch",
      },    
      title:{
          fontSize:30,
          fontWeight:'700',
          color:"#d8deeb"
      
      },
      titreRanking:{
          alignItems:"center",
          justifyContent:"center",
          margin:15,
          marginBottom:0
      },
      titreText:{
          color:"#ddd",
          fontWeight:"bold",
          fontSize:20
      },bottomView:{
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