
import * as React from 'react';
import { Text, View, ScrollView, StatusBar, Dimensions } from 'react-native';


import { Loading } from '../components/loading'
import { getItemValue } from '../utils/storage'
import { fetchRanking } from '../api/getRankings'

import { popupMessage } from '../utils/miscellaneous'
import {RankingRow} from  '../components/rankingComponents'
import { generalStyle} from '../style/generalStyle'
import {rankingStyle} from '../style/rankingStyle'

const { width, height } = Dimensions.get("window");



export default class RankingView extends React.Component {

    state = {
        userInfos: undefined,
        ranking: undefined,
        scrollLayer: 0
    };

    componentDidMount() {
        getItemValue("@user_infos").then((res) => this.setState({ userInfos: JSON.parse(res) }));
        fetchRanking()
            .then((res) => this.setState({ ranking: JSON.parse(res.data) }))
            .catch((err) => popupMessage("error", "Erreur de récupération des données", err.message));
    }

    
    getRanking(){
        let nArray = [];

        for (let i = 0; i < 3; i++) {
            let whatWePush = "rgb(114, 104, 153)";
            if ((this.state.scrollLayer / width - 1 / 2) <= i && (this.state.scrollLayer / width + 1 / 2) > i) {
                whatWePush = "rgb(208, 204, 224)";
            }
            nArray.push(whatWePush);
        }
        return nArray;
    }
    render() {
        if (this.state.userInfos == undefined || this.state.ranking == undefined) {
            return <Loading />
        }

        let nArray = this.getRanking();
        
        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />
                <View style={generalStyle.topView}>
                    <Text style={generalStyle.title}>Classement</Text>
                </View>
                <ScrollView
                    snapToInterval={width}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    style={generalStyle.fullWidth}
                    onScroll={(e) => this.setState({ "scrollLayer": e.nativeEvent.contentOffset.x })}
                    horizontal>
                    <View style={generalStyle.fullWidth}>
                        <View style={rankingStyle.titreRanking}>
                            <Text style={rankingStyle.titreText}>
                                Distance totale
                            </Text>
                        </View>
                        <ScrollView style={rankingStyle.ranking}>

                            {this.state.ranking.total.map(item =>
                                <RankingRow params={{ 
                                    rank: item.rank, 
                                    pseudo: item.pseudo, 
                                    dist: item.score }}/>) 
                            }

                        </ScrollView>
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <View style={rankingStyle.titreRanking}>
                            <Text style={rankingStyle.titreText}>
                                Distance mécanique
                    </Text>
                        </View>
                        <ScrollView style={rankingStyle.ranking}>

                            {this.state.ranking.total.map(item =>
                                <RankingRow params={{ 
                                    rank: item.rank, 
                                    pseudo: item.pseudo, 
                                    dist: item.score }}/>) 
                            }
                        </ScrollView>
                    </View>
                    <View style={generalStyle.fullWidth}>
                        <View style={rankingStyle.titreRanking}>
                            <Text style={rankingStyle.titreText}>
                                Distance ce mois-ci
                    </Text>
                        </View>
                        <ScrollView style={rankingStyle.ranking}>

                            {this.state.ranking.total.map(item =>
                                <RankingRow params={{ 
                                    rank: item.rank, 
                                    pseudo: item.pseudo, 
                                    dist: item.score }}/>) 
                            }
                        </ScrollView>
                    </View>
                </ScrollView>
                <View style={generalStyle.bottomView}>
                    {nArray.map((whatWePush) => <View style={[generalStyle.bottomDot, { backgroundColor: whatWePush }]}/>)}
                </View>
            </View>

        )
    }
}


