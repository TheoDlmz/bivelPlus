
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");


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
    fullWidth:{
        width: width 
    },
    bottomView: {
        position: "absolute",
        bottom: 0,
        paddingBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignSelf:"center"
    },
    bottomDot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        margin: 5
    },
    boldText:{
        fontWeight:'bold'
    },
    classic:
    {
        flex:1
    },
    classicRow:
    { 
        flex: 1,
        flexDirection: "row" 
    }

})