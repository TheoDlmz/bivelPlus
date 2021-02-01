
import { StyleSheet } from 'react-native';

export const qrReaderStyle = StyleSheet.create({
    decoCamera:{
        width:250,
        height:250,
        borderColor:"white",
        borderWidth:5,
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