import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'

import {Loading} from './loading'
import {fetchReports} from '../api/getReports'

export default class UserReportsView extends React.Component{

    state={
        reports:undefined
    };
    
    componentDidMount() {
        fetchReports().then((res) => this.setState({reports:JSON.parse(res.data)})).catch((err) => Toast.show({
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

    ReportItem(item) {
        if (item.type == "date"){
            let year = item.value.substring(0,4);
            let month = item.value.substring(5,7);
            let day = item.value.substring(8,10);
            let strdate = day +"/"+month+"/"+year;
            return (<View style={styles.dateItem}>
                <View style={styles.dividerDate}></View>
                <Text style={styles.dateText}>{strdate}</Text>
                <View style={styles.dividerDate}></View>
        </View>)
        }else{

            return(<View style={styles.reportItemContainer}>
                <View style={styles.reportItem}>
                <Text style={styles.reportText}>{"#" + item.velib_id + " : "+ item.error}</Text>
            </View>{item.station != "" && 
            <View style={styles.reportItemLocation}>
                <Icon name='map-marker' 
                        type='material-community'
                        color="#aaa" 
                        style={{margin:2}}
                        size={12} />
                <Text style={styles.reportItemLocationText}>{item.station}</Text></View>}</View>
            )
        }
        


    }

    render() {
        if (this.state.reports == undefined){
            return <Loading/>
        }

        let reports = this.state.reports.user_data;
        let reportsList = [];
        let date;
        for (let i = 0; i < reports.length; i++){
            let record = reports[i];
            if (record.date != date){
                let item = {"type": "date", "value": record.date};
                date = record.date;
                reportsList.push(item);
            }
            record['type'] = 'report';
            reportsList.push(record);
        }
     
        return ( 
            <View style={styles.container}>
                
                <StatusBar hidden={true} />
            <View style={styles.topView}>
                    <Text style={styles.pseudo}>Signalements</Text>
            </View>
            <View
            style={styles.generalStats}>
                <View style={styles.blocGeneralStats}>
                    <Text style={styles.statsValue}>
                        {this.state.reports.total}
                    </Text>
                    <Text style={styles.statsText}>
                        Total
                    </Text>
                </View>
                
                <View style={styles.blocGeneralStats}>
                    <Text style={styles.statsValue}>
                        {this.state.reports.user_data.length}
                    </Text>
                    <Text style={styles.statsText}>
                        Vous
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.signalementBouton}
            onPress={() =>
                this.props.navigation.navigate ('QR')} >
                <Text style={{fontSize:16, color:"#ddd", fontWeight:"bold"}}>
                    Faire un signalement
                </Text>
            </TouchableOpacity>
            <FlatList
                    data={reportsList}
                    renderItem={(item) => this.ReportItem(item.item)}
                    keyExtractor={item => item.id}
            />
            
            </View>

    )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgb(40, 62, 105)"
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
          
          },
          signalementBouton:{
              alignSelf:"stretch",
              margin:15,
              backgroundColor:"rgba(230, 90, 71,0.7)",
              borderRadius:25,
              padding:10,
              alignItems:"center"
          },
          generalStats:{
              flexDirection:"row",
              alignItems:"center",
              margin:10
          },
          blocGeneralStats:{
              flex:1,
              alignItems:"center",
              justifyContent:"center"
          },
          statsValue:{
              color:"#eee",
              fontSize:45,
              fontWeight:"700"
          },
          statsText:{
              color:"#eee",
              fontSize:17,
              fontWeight:"600"
          },
          reportItem:{
              backgroundColor:"rgba(9, 28, 48, 0.8)",
              padding:10,
          },
          reportItemContainer:{
            margin:5,
            marginHorizontal:15,

          },
          dateItem:{
              alignItems:"center",
              padding:5,
              flexDirection:"row",
              justifyContent:"center"
          },
          dateText:{
              color:"#ccc",
              fontWeight:"500",
          },
          dividerDate:{
              flex:1,
              height:2,
              backgroundColor:"#ccc",
              margin:10
          },
          reportText:{
              color:"#bbb",
              fontWeight:"600"
          },
          reportItemLocation:
          {
              marginTop:3,
              marginLeft:5,
              flexDirection:"row"
          },
          reportItemLocationText:{
              color:"#aaa",
              fontSize:12,
          }
   


});