import * as React from 'react';
import { View,Image, TouchableHighlight } from 'react-native';

import { badgesItemStyle} from '../style/badgesStyle'


export class BadgeItem extends React.Component {

    render() {
        let kind = this.props.kind;
        let opacity = 1;
        let blurRadius = 0;
        let backgroundColor = "white";
        let underlay = "#1e305c";
        if (kind == "blurred") {
            opacity = 0.4;
            blurRadius = 5;
            backgroundColor = "#534780";
            underlay = "";
        } else if (kind == "voyage") {
            backgroundColor = "#c2caed";

        } else if (kind == "badge") {
            let level = this.props.level;
            if (level == 0) {
                backgroundColor = "rgba(238, 245, 142, 0.2)";
            } else if (level == 1) {
                backgroundColor = "rgba(238, 245, 142, 0.5)";
            } else if (level == 2) {
                backgroundColor = "rgba(238, 245, 142, 1)";
            }
        } else if (kind == "event") {
            backgroundColor = "#add9db";
        }
        return (
            <TouchableHighlight
                style={[badgesItemStyle.badgeIcon, { backgroundColor: backgroundColor}]}
                onPress={this.props.onPress}
                underlayColor={underlay}
            >
                {this.props.index.Pic != undefined &&
                    <View>
                        <Image
                            style={[badgesItemStyle.badgeImage, { tintColor: 'gray' }]}
                            source={{ uri: 'http://theo.delemazure.fr/bivelAPI/badges/' + this.props.index.Pic }}
                        />
                        <Image
                            style={[badgesItemStyle.badgeImage, { position: 'absolute', opacity: opacity }]}
                            blurRadius={blurRadius}
                            source={{ uri: 'http://theo.delemazure.fr/bivelAPI/badges/' + this.props.index.Pic }}
                        />
                    </View>
                }

            </TouchableHighlight>
        )
    }
}