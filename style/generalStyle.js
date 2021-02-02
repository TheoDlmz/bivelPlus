
import { StyleSheet } from 'react-native';

export const generalStyle = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgb(40, 62, 105)"
    },
    topView:{
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
    sideTopView:{
        width:60,
        alignItems:"center",
        justifyContent:"center"
    },
    center:{
        alignItems:"center",
        justifyContent:"center"
    },
})