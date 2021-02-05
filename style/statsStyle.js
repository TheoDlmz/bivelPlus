import { StyleSheet } from 'react-native';

export const statsStyle = StyleSheet.create({
    tableInfos: {
        flexDirection: "row",
    },
    tableInfosItem: {
        flex: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    tableInfosText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    },
    tableInfosValue: {
        fontSize: 16
    },


});


export const chartsStyle = StyleSheet.create({
    containerChart: {
        flex: 1,
        padding: 20,
        paddingBottom: 30,
        alignItems: "stretch"
    },
    chartTitleText:
    {
        fontSize: 20,
        color: "#ddd",
        textAlign: "center"
    },
    flyingBox: {
        position: "absolute",
        zIndex: 1,
        padding: 10,
        backgroundColor: 'rgba(40, 28, 89,0.6)',
        borderRadius: 10,
        width: 150,
        justifyContent: "center",
        alignItems: "center"
    },
    flyingBoxText: {
        textAlign: "center",
        color: "#ddd"
    }

});