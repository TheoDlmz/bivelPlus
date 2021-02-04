import { StyleSheet } from 'react-native';

export const badgesStyle = StyleSheet.create({
    titleText: {
        fontSize: 25,
        color: "#ddd",
        fontWeight: "bold"
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 5
    }, 
    badgeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        alignItems: "center"
    },
    whiteOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.8,
        backgroundColor: "#d0dbf7",
        alignItems: "stretch",
        justifyContent: "center"
    },
    TouchableOverlay: {
        height: "100%",
        alignItems: "stretch",
        justifyContent: "center"
    },
    messageBadge: {
        margin: 15,
        backgroundColor: "rgb(34, 49, 87)",
        alignItems: "center",
        padding: 20
    },
    badgeTitle: {
        margin: 2,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#ddd"
    },
    badgeDesc: {
        margin: 1,
        fontSize: 16,
        textAlign: "center",
        color: "#ddd"
    },
    mapStyle:
    { 
        marginHorizontal: 20,
        height: 150 
    },


});

export const badgesItemStyle = StyleSheet.create({
    badgeIcon: {
        width: 90,
        height: 90,
        margin: 10,
        opacity: 0.8,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    badgeImage: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
})