import { StyleSheet } from 'react-native';

export const rankingStyle = StyleSheet.create({
    ranking: {
        padding: 5,
        margin: 20
    },
    titreRanking: {
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
        marginBottom: 0
    },
    titreText: {
        color: "#ddd",
        fontWeight: "bold",
        fontSize: 20
    }, 

})


export const rankingItemStyle = StyleSheet.create({
    blockranking: {
        height: 40,
        flexDirection: "row"
    }, pseudo: {
        flex: 0.6,
        padding: 10,
        justifyContent: "center"
    }, boldTxt: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ddd"
    }, score: {
        flex: 0.35,
        padding: 10,
        justifyContent: "center",
        alignItems: "flex-end"
    }, normalTxt: {
        fontSize: 18,
        color: "#ddd"
    }, rank: {
        backgroundColor: "rgba(23, 12, 54, 0.6)",
        flex: 0.05,
        padding: 10,
        justifyContent: "center"

    },

})