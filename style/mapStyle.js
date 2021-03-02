import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const mapStyle = StyleSheet.create({
  markerView:
  {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  smallMarkerView:
  {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  topView:
  {
    position: "absolute",
    height: 80,
    top: 0,
    flexDirection: 'row',
    width: "100%",
    backgroundColor: "rgb(25, 41, 71)",
    borderBottomWidth: 0,
    paddingRight: 5,
    paddingLeft: 5,
    borderBottomColor: "rgba(0,0,0,0.5)",
    justifyContent: "space-between"
  },

  pseudoText: {
    marginTop: -8,
    color: '#ddd',
    fontSize:12,
    fontFamily: 'MontserratRegular' 
  },
  signalerText: {
    marginTop: -4,
    fontSize:12,
    color: 'rgb(230, 221, 62)',
    fontFamily: 'MontserratRegular' 
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontFamily: 'MontserratRegular' 
  },
  animatedBlob: {
    height: 50,
    width: 50,
    backgroundColor: "rgba(32, 39, 71,0.9)",
    position: "absolute",
    borderRadius: 50,
    top: 3,
  },
  select: {
    position: "absolute",
    backgroundColor: "rgba(54, 62, 99,0.9)",
    top: 90,
    alignSelf: "center",
    flexDirection: "row",
    padding: 3,
    borderRadius: 40,
  },

  bottomView: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgb(25, 41, 71)",
    borderRadius: 2,
    bottom: 10,
    padding: 10
  },
  stationName: {
    color: "white",
    fontFamily:"MontserratRegular",
    fontSize: 18,
  },
  bottomTextValue: {
    color: "white",
    fontFamily:"MontserratRegular",
    fontSize: 22
  },
  bottomTextDescVelo: {
    color: "#ddd",
    textAlign: 'center',
    fontFamily:"MontserratRegular",
    fontSize: 10
  },
  bottomTextBulle: {
    alignItems: "center",
    width:"30%",
  },
  bottomViewInfos: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: "100%"
  },
  markerDivider:{ 
    backgroundColor: "white", 
    opacity:0.6, 
    width: 2, 
    height:40
  },
  markerTextVelib:{ 
    color: "white", 
    width:17, 
    textAlign:"center",
    fontWeight:"bold"
  },
  markerTextTime:{ 
    color: "white",
     fontSize: 10, 
     marginTop: -5 ,
     fontFamily:"MontserratRegular",
    },
  markerText:{ 
    color: "white", 
    fontFamily:"MontserratRegular"
  }

});

export const mapRidesStyle = StyleSheet.create({


  layerBloc: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: "#a3acd6"
  },
  layerArrow: {
    width: 50,
    alignItems: "stretch",
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5
  },
  oneLayer: {
    width: width - 100,
    alignItems: "center",
    justifyContent: "center"
  },
  fontLayer: {
    fontSize: 26,
  },

})