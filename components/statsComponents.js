import * as React from 'react';
import { Text, View} from 'react-native';

import { statsStyle } from '../style/statsStyle'

export class StatsTableItem extends React.Component {
    state =
        {
            text: this.props.params.text,
            value: this.props.params.value
        }

    render() {


        let opacity;
        if (this.props.params.id % 2 == 0) {
            opacity = 0.7;
        } else {
            opacity = 0.4;
        }

        return (
            <View style={[statsStyle.tableInfos, { backgroundColor: `rgba(99, 230, 219,${opacity})` }]}>
                <View style={[statsStyle.tableInfosItem]}>
                    <Text style={statsStyle.tableInfosText}>
                        {this.state.text}
                    </Text>
                </View>
                <View style={statsStyle.tableInfosItem}>
                    <Text style={statsStyle.tableInfosValue}>
                        {this.state.value}
                    </Text>
                </View>
            </View>
        )
    }
}
