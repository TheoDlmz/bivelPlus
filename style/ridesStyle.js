import { StyleSheet } from 'react-native';

export const ridesStyle = StyleSheet.create({
    seeRideView:
    {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    seeRideMapView:
    {
        width: "80%",
        height: "60%",
        borderColor: "rgb(25, 41, 71)",
        borderWidth: 5,
        borderRadius: 2
    },
    closeButton:
    {
        backgroundColor: "rgb(179, 64, 90)",
        padding: 5,
        width: "80%",
        alignItems: "center",
        borderColor: "rgb(25, 41, 71)",
        borderTopWidth: 0,
        borderWidth: 5,
        borderRadius: 2
    },
    closeButtonText:
    {
        color: "white",
        fontSize: 21
    }
});

export const rideItemStyle = StyleSheet.create({
    oneRide: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rideBloc: {
        flex: 7,
        margin: 5,
        padding: 5,
        alignItems: "stretch"
    },
    rowRideBloc: {
        flexDirection: "row",
        justifyContent: "center",
    },
    textInfo:{
        color: "#ddd" 
    },
    divider: {
        marginLeft: 10,
        marginRight: 10,
        height: 1,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#a5a7c2'
    },
    rideSubBloc: {
        flexDirection: 'row',
        padding: 5,
        flex: 1
    },
    boutonRide: {
        flex: 1,
        alignSelf: 'stretch',
        margin: 5,
        backgroundColor: "rgba(200,0,0,0.5)",
        justifyContent: "center",
        alignItems: "stretch",
        padding: 10,

    }


});