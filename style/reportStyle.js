
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const qrReaderStyle = StyleSheet.create({
    decoCamera:{
        width:250,
        height:250,
        borderColor:"white",
        borderWidth:5,
        alignItems:"center",
        justifyContent:"center"
    },
    goButton:{
        width:250,
        height:250,
        borderColor:"white",
        borderWidth:5,
        backgroundColor:"rgba(81, 207, 78,0.8)",
        alignItems:"center",
        justifyContent:"center"
    },
    goText:{
        fontSize:40,
        color:"white",
        fontWeight:"bold"
    },
    textScanQR:{
        color:"white",
        fontSize:25,
    },
    inputId:{
        width:250,
        backgroundColor:"rgba(0,0,0,0.5)",
        marginTop:10,
        padding:10,
        textAlign:"center",
        fontSize:18,
        color:"white",
    },
    topTextView:{
        width:250,
        backgroundColor:"rgba(0,0,0,0.5)",
        marginBottom:10,
        padding:5,
        alignItems:"center",
        justifyContent:"center"
    },
    errorMessage:{
        color:"white",
        fontSize:20,
        paddingTop:50

    }
});

export const reportStyle = StyleSheet.create({
    containerBoxes: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: 10,
        width: width-20
    },
    reportMessage: {
        alignItems: "center",
    },
    reportMessageText:{ 
        fontSize: 25,
         color:"#eee" 
    },
    displayMessage: {
        alignItems: "stretch",
        justifyContent: "center",
        flexDirection: "column",
        margin: 10,
        width: width - 20,
    },
    boxError1: {
        width: width / 2 - 20,
        borderWidth: 5,
        borderColor: "rgba(21, 25, 38,0.9)",
        backgroundColor: "rgb(182, 191, 219)",
        margin: 5,
        height: height / 4 - 35,
        padding: 10,
        alignItems: "center",
        padding:2,
        justifyContent:"center"
    },
    boxError2: {
        width: width - 40,
        borderWidth: 3,
        borderColor: "rgba(21, 25, 38,0.9)",
        backgroundColor: "rgb(182, 191, 219)",
        margin: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    titleReport: {
        fontWeight: 'bold',
        fontSize: 20
    },
    imageError: {
        width: (height / 4 - 40) * 0.7,
        height: (height / 4 - 40) * 0.7,
        borderRadius: (height / 4 - 40) * 0.35,
        borderWidth: 2,
        borderColor: "rgba(21, 25, 38,0.5)",
    },
    boxRetour:{
        borderColor: 'rgba(212, 49, 0,0.6)',
        backgroundColor: 'rgba(212, 49, 0,0.3)',
        flexDirection: 'row',
        marginRight: 30
    },
    textRetour:{ 
        textAlign: "center", 
        color: '#ddd' 
    },
    boxAgain:
    {
        borderColor: 'rgba(66, 109, 158,0.6)',
        backgroundColor: 'rgba(66, 109, 158,0.3)',
        flexDirection: 'row',
        marginRight: 30
    }

});

export const userReportStyle = StyleSheet.create({
    signalementBouton: {
        alignSelf: "stretch",
        margin: 15,
        backgroundColor: "rgba(230, 90, 71,0.7)",
        borderRadius: 25,
        padding: 10,
        alignItems: "center"
    },
    generalStats: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10
    },
    blocGeneralStats: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    statsValue: {
        color: "#eee",
        fontSize: 45,
        fontWeight: "700"
    },
    statsText: {
        color: "#eee",
        fontSize: 17,
        fontWeight: "600"
    },
    signalementText:{ 
        fontSize: 16, 
        color: "#ddd", 
        fontWeight: "bold" 
    }

})

export const reportItemStyle = StyleSheet.create({
    reportItem: {
        backgroundColor: "rgba(9, 28, 48, 0.8)",
        padding: 10,
    },
    reportItemContainer: {
        margin: 5,
        marginHorizontal: 15,
    },
    dateItem: {
        alignItems: "center",
        padding: 5,
        flexDirection: "row",
        justifyContent: "center"
    },
    dateText: {
        color: "#ccc",
        fontWeight: "500",
    },
    dividerDate: {
        flex: 1,
        height: 2,
        backgroundColor: "#ccc",
        margin: 10
    },
    reportText: {
        color: "#bbb",
        fontWeight: "600"
    },
    reportItemLocation:
    {
        marginTop: 3,
        marginLeft: 5,
        flexDirection: "row"
    },
    reportItemLocationText: {
        color: "#aaa",
        fontSize: 12,
    }



});