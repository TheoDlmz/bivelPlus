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
    fontWeight: "bold",
    color: '#ddd'
  },
  signalerText: {
    marginTop: -4,
    fontWeight: "bold",
    color: 'rgb(230, 221, 62)'
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
    right: 0
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
    fontWeight: "700",
    fontSize: 18,
  },
  bottomTextValue: {
    color: "white",
    fontWeight: "800",
    fontSize: 22
  },
  bottomTextDescVelo: {
    color: "#ddd",
    textAlign: 'center',
    fontSize: 10
  },
  bottomTextBulle: {
    margin: 5,
    alignItems: "center",
    flex: 1
  },
  bottomViewInfos: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: "100%"
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