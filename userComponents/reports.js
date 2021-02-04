import * as React from 'react';
import { Text, View, StatusBar, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { Loading } from '../components/loading'
import { fetchReports } from '../api/getReports'
import { popupMessage } from '../utils/miscellaneous'
import { ReportItemView } from '../components/reportsUserComponents'

import { generalStyle } from '../style/generalStyle'
import { userReportStyle } from '../style/reportStyle'


export default class UserReportsView extends React.Component {

    state = {
        reports: undefined
    };

    componentDidMount() {
        fetchReports()
            .then((res) => this.setState({ reports: JSON.parse(res.data) }))
            .catch((err) => popupMessage('error', 'Erreur de récuperation des données', err.message));
    }

    getReports() {
        let reports = this.state.reports.user_data;
        let reportsList = [];
        let date;
        for (let i = 0; i < reports.length; i++) {
            let record = reports[i];
            if (record.date != date) {
                let item = { "type": "date", "value": record.date };
                date = record.date;
                reportsList.push(item);
            }
            record['type'] = 'report';
            reportsList.push(record);
        }
        return reportsList
    }

    render() {
        if (this.state.reports == undefined) {
            return <Loading />
        }

        let reportsList = this.getReports();

        return (
            <View style={generalStyle.container}>
                <StatusBar hidden={true} />
                <View style={generalStyle.topView}>
                    <Text style={generalStyle.title}>
                        Signalements
                    </Text>
                </View>
                <FlatList
                    data={reportsList}
                    ListHeaderComponent={
                        <View>
                            <View style={userReportStyle.generalStats}>
                                <View style={userReportStyle.blocGeneralStats}>
                                    <Text style={userReportStyle.statsValue}>
                                        {this.state.reports.total}
                                    </Text>
                                    <Text style={userReportStyle.statsText}>
                                        Total
                                    </Text>
                                </View>
                                <View style={userReportStyle.blocGeneralStats}>
                                    <Text style={userReportStyle.statsValue}>
                                        {this.state.reports.user_data.length}
                                    </Text>
                                    <Text style={userReportStyle.statsText}>
                                        Vous
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={userReportStyle.signalementBouton}
                                onPress={() => this.props.navigation.navigate('QR')} >
                                <Text style={userReportStyle.signalementText}>
                                    Faire un signalement
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    renderItem={(x) => <ReportItemView item={x.item} />}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }
}