import * as React from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import { Icon } from 'react-native-elements';
import {profileComponentsStyle} from '../style/profileStyle';

export class ProfileButton extends React.Component{
    render(){
        return(
            <TouchableOpacity 
                style={profileComponentsStyle.oneButton}
                onPress={this.props.onPress} 
                activeOpacity={0.5}
            >
                <Icon 
                    name={this.props.icon}
                    type='material-community'
                    color="white" 
                    size={45} 
                />
                <Text style={profileComponentsStyle.textButton}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>)
    }
}


export class RideItem extends React.Component{

    state={
        params: this.props.params,
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps != this.props;
    }
    render(){
        let params = this.state.params;
        let color = "#d0f086";
        let elec = params.elec;
        let date = new Date(params.date);

        if (params.dist < 100){
            color = "#dea38a";
        }else if(elec){
            color = "#8ac6de";
        }

        let timefin = new Date(date.getTime()+ params.duration*1000);

        return (
            <View style={[profileComponentsStyle.rideBloc,{backgroundColor:color}]} >
                <View
                    style={[profileComponentsStyle.rideSubBloc,{justifyContent:'space-between',padding:0}]}
                >
                    <View style={profileComponentsStyle.rideSubBloc}>
                        <Icon name='calendar'
                            type='material-community'
                            style={{marginRight:5}}
                            size={20} />
                        <Text>
                            {date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()}
                        </Text>
                    </View>
                    {params.elec &&
                        <Icon name='flash'
                            type='material-community'
                            style={{paddingTop:2}}
                            size={20} />
                    }
                </View>
                <View style={profileComponentsStyle.rideSubBloc}>
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
                <View style={profileComponentsStyle.rideSubBloc}>
                    <Icon name='bike'
                        type='material-community'
                        style={{marginRight:5}}
                        size={20} />
                    <Text>
                        {params.dist/1000 + " km"}
                    </Text>
                </View>
            </View>
        )
    }
}

