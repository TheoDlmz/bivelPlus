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
    width: width-100,
    alignItems: "center",
    justifyContent: "center"
  },
  fontLayer: {
    fontSize: 26,
  },
})