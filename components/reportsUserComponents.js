import * as React from 'react';
import { Text, View} from 'react-native';
import { Icon } from 'react-native-elements'

import {reportItemStyle} from '../style/reportStyle'




export class ReportItemView extends React.Component {
    state = {
        item:this.props.item
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    render(){
        let item = this.state.item;
        if (item.type == "date") {

            let year = item.value.substring(0, 4);
            let month = item.value.substring(5, 7);
            let day = item.value.substring(8, 10);
            let strdate = day + "/" + month + "/" + year;

            return (
            <View style={reportItemStyle.dateItem}>
                <View style={reportItemStyle.dividerDate}/>
                <Text style={reportItemStyle.dateText}>{strdate}</Text>
                <View style={reportItemStyle.dividerDate}/>
            </View>)
        }else{

            return (
            <View style={reportItemStyle.reportItemContainer}>
                <View style={reportItemStyle.reportItem}>
                    <Text style={reportItemStyle.reportText}>
                        {"#" + item.velib_id + " : " + item.error}
                    </Text>
                </View>
                {item.station != "" &&
                    <View style={reportItemStyle.reportItemLocation}>
                        <Icon name='map-marker'
                            type='material-community'
                            color="#aaa"
                            style={{ margin: 2 }}
                            size={12} />
                        <Text style={reportItemStyle.reportItemLocationText}>
                            {item.station}
                        </Text>
                    </View>
                }
            </View>
            )
        }
    }
}

