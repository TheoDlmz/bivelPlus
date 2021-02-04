
import * as React from 'react';
import { Text, View } from 'react-native';
import {rankingItemStyle} from '../style/rankingStyle'

export class RankingRow extends React.Component {
    state =
        {
            params: this.props.params
        }

    render() {
        
        let opacity;
        if (this.state.params.rank % 2 == 0) {
            opacity = 0.8;
        } else {
            opacity = 0.4;
        }
        return (
            <View style={[rankingItemStyle.blockranking, { backgroundColor: `rgba(23, 12, 54,${opacity})` }]}>
                <View style={rankingItemStyle.rank}>
                    <Text style={rankingItemStyle.boldTxt}>
                        {this.state.params.rank}
                    </Text>
                </View>
                <View style={rankingItemStyle.pseudo}>
                    <Text style={rankingItemStyle.boldTxt}>
                        {this.state.params.pseudo}
                    </Text>
                </View>
                <View style={rankingItemStyle.score}>
                    <Text style={rankingItemStyle.normalTxt}>
                        {this.state.params.dist + " km"}
                    </Text>
                </View>
            </View>
        )


    }
}