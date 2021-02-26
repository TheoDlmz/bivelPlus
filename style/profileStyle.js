
import { StyleSheet } from 'react-native';

export const profileStyle = StyleSheet.create({
    topView:{
        height:80,
        backgroundColor:"rgb(25, 41, 71)",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingRight:5,
        paddingLeft:5,
        alignSelf:"stretch",
    },

    // TopView Style
    sideTopText:{
        marginTop:-4,
        fontWeight:"bold",
        color:'#d8deeb'
    },
    pseudoText:{
        fontSize:30,
        fontWeight:'700',
        color:"#d8deeb"   
    },
    scoreText:{
        letterSpacing:2, 
        color:"#d8deeb"
    },

    // Trajets Style
    lastRides:{
        flexDirection:'row',
        margin:5,
        marginTop:10,
        flex:1
    },

    // Boutons Style
    buttonView:{
        flex:3.8,
        margin:5,
        flexWrap:'wrap',
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    logOutButton:{
        position:"absolute",
        bottom:0,
        width:"100%",
        padding:10,
        backgroundColor:"rgb(209, 68, 52)",
        alignItems:"center",
        justifyContent:"center"
    },
    textButton:{
        fontSize:17,
        color:"white",
        fontWeight:"bold"
    },
});


export const profileComponentsStyle = StyleSheet.create({
    textButton:{
        fontSize:17,
        color:"white",
        fontWeight:"bold"
    },
    oneButton:{
        width:'45%',
        height:'27%',
        backgroundColor:"rgb(25, 41, 71)",
        margin:5,
        alignItems:"center",
        justifyContent:"center"
    }, 
    rideBloc:{
        width:150,
        margin:5,
        alignItems:"stretch"
    },
    rideSubBloc:{
        flexDirection:'row',
        padding:5,
    },

});



export const loginStyle = StyleSheet.create({
    containerLogin:{
        flex: 1, 
        alignItems: 'stretch',
        backgroundColor:"rgb(40, 62, 105)",
     },
    input: {
        backgroundColor:'#dae4f5',
        fontSize:18,
        padding:10,
        marginBottom:10,
        borderRadius:50,
        paddingLeft:20,
        paddingRight:20
        
      },
      buttonLogin:{
        backgroundColor:'#6da3de',
        padding:8,
        marginTop:20,
        paddingLeft:20,
        paddingRight:20,
        alignItems:"center",
      },
      buttonText:{
        color:'white',
        fontSize:19,
        fontWeight:'bold'
      },
      loginBox:{
          padding:20
      }

});