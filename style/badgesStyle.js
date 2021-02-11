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
        alignItems: "stretch",
        justifyContent: "center"
    },
    TouchableOverlay: {
        opacity: 0.8,
        backgroundColor: "#d0dbf7",
        height: "100%",
        alignItems: "stretch",
        justifyContent: "center"
    },
    messageBadge: {
        margin: 15,
        backgroundColor: "rgb(34, 49, 87)",
        alignItems: "center",
        position: "absolute",
        alignSelf: "center",
        padding: 20
    },
    badgeTitle: {
        margin: 2,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#eee"
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
    imageBadge:
    {
        width: 140,
        height: 140,
        borderRadius: 140,
        marginTop: -100
    },
    countBar:
    {
        backgroundColor: "#b9cfed",
        height: 20,
        width: "100%",
        alignItems: "center",
        marginTop: 10
    },
    loadingBar:
    {
        position: "absolute",
        height: 20,
        backgroundColor: "#6d94c9",
        alignSelf: "flex-start"
    }


});

export const badgesItemStyle = StyleSheet.create({
    badgeIcon: {
        width: 88,
        height: 88,
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