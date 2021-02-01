import * as React from 'react';
import {  View, ActivityIndicator, StyleSheet, Text} from 'react-native';


export class Loading extends React.Component{
    render(){
    return (<View
    style={styles.container}>
        <Text style={styles.loadingText}>
            Loading...
        </Text>
        <ActivityIndicator
        animating = {true}
        color = '#ddd'
        size = "large"/>
        </View>);
    }
}


const styles = StyleSheet.create({
    container:
    {flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"rgb(40, 62, 105)"
    },
    loadingText:
    {
        color:"#ddd",
        fontSize:24,
        fontWeight:"700",
        margin:10
    }
})