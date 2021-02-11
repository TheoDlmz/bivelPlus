import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { StackedAreaChart, Grid, XAxis, YAxis, StackedBarChart, AreaChart, PieChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { fetchStationInfos } from '../api/getStations'

import {
    evolDist, distribDistHour, distribSpeed, distribDistDay,
    jourNuit, distribDistOneDay, distribDist
} from '../utils/graphFunctions'


import { chartsStyle } from '../style/statsStyle'
import { generalStyle } from '../style/generalStyle'

const { width, height } = Dimensions.get("window");

const colorMeca = 'rgba(99, 230, 219, 0.7)';
const colorElec = 'rgba(99, 230, 219, 0.4)';
const gridSvg = {
    stroke: "#bbb",
    strokeOpacity: 0.2,
    strokeWidth: 3
}

export class Speed extends React.Component {

    state = {
        isBoxActive: false,
        posBox: { x: undefined },
        data: undefined,
        labels: undefined
    };

    componentDidMount() {
        let dataDist = distribSpeed(this.props.rides);

        let speedElec = dataDist[0];
        let speedMeca = dataDist[1];
        let labels = dataDist[2];
        let nMonths = speedElec.length;

        let data = [];
        for (let i = 0; i < nMonths; i++) {
            data.push({
                label: labels[i],
                meca: speedMeca[i],
                elec: speedElec[i] - speedMeca[i],
            })
        }
        this.setState({
            data: data,
            labels: labels
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }

    handlePressIn(evt) {
        let x = evt.nativeEvent.locationX;
        this.setState({
            isBoxActive: true,
            posBox: { x: x }
        })
    }

    getBar() {
        let xBar;
        if (this.state.isBoxActive) {
            let labels = this.state.labels;
            let xmax = labels[labels.length - 1];
            xBar = xmax * (this.state.posBox.x) / (width - 40);
        }

        let decal = 0;
        if (this.state.posBox.x > width - 100) {
            decal = 90
        }

        return { xBar: xBar, decal: decal }
    }


    render() {

        if (this.state.data == undefined) {
            return <View />
        }

        let data = this.state.data;
        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;


        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Vitesse moyenne en vélo
                        <Text
                            style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={generalStyle.classic}>
                    <StackedAreaChart
                        style={{ flex: 1 }}
                        data={data}
                        keys={["meca", "elec"]}
                        contentInset={{ top: 20 }}
                        colors={[colorMeca, colorElec]}
                        curve={shape.curveNatural}
                        numberOfTicks={5}
                        animate={true}
                        animationDuration={1000}
                    >
                        <Svg>
                            <Rect
                                height={height}
                                width={width}
                                onPressIn={(evt) => this.handlePressIn(evt)}
                                onPressOut={() => this.setState({ isBoxActive: false })}
                                onResponderMove={(evt) => this.handlePressIn(evt)}
                            />

                            {this.state.isBoxActive &&
                                <Line
                                    x1={this.state.posBox.x}
                                    y1="0"
                                    x2={this.state.posBox.x}
                                    y2={height - 20}
                                    stroke={colorMeca}
                                    strokeWidth="3"
                                />
                            }
                            {this.state.isBoxActive &&
                                <View style={[
                                    chartsStyle.flyingBox,
                                    {
                                        width: 80,
                                        left: this.state.posBox.x + 5 - decal,
                                        top: 10
                                    }]}>
                                    <Text style={chartsStyle.flyingBoxText}>
                                        {Math.round(xBar) + " km/h"}
                                    </Text>
                                </View>
                            }

                        </Svg>
                    </StackedAreaChart>
                </View>
            </View>
        )
    }
}

export class Night extends React.Component {

    state = {
        isBoxActive: false,
        quarterBox: undefined,
        posBox: { x: undefined, y: undefined },
        data: { jour: undefined, nuit: undefined }
    };

    componentDidMount() {
        const dataDist = jourNuit(this.props.rides);

        const jour = dataDist[0];
        const nuit = dataDist[1];
        this.setState({ data: { jour: jour, nuit: nuit } });

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }


    handlePressIn(evt, type) {
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        x = Math.min(x, width - 160);
        this.setState({
            isBoxActive: true,
            quarterBox: type,
            posBox: { x: x, y: y }
        })
    }

    render() {

        if (this.state.data == undefined) {
            return <View />
        }
        let jour = this.state.data.jour;
        let nuit = this.state.data.nuit;

        let opacityNight = 1;
        let opacityDay = 1;
        let text;

        if (this.state.isBoxActive) {
            if (this.state.quarterBox == "day") {
                opacityNight = 0.3;
                text = Math.round(jour) + " km parcourus le jour";
            } else if (this.state.quarterBox == "night") {
                opacityDay = 0.3;
                text = Math.round(nuit) + " km parcourus la nuit";
            }
        }

        let pieData = [
            {
                value: jour,
                svg: {
                    fill: "#9e95de",
                    opacity: opacityDay,
                    onPressIn: (evt) => this.handlePressIn(evt, "day"),
                    onPressOut: () => this.setState({ isBoxActive: false }),
                    onResponderMove: (evt) => this.handlePressIn(evt, "day")
                },
                key: `jour`
            },
            {
                value: nuit,
                svg: {
                    fill: "#856ceb",
                    opacity: opacityNight,
                    onPressIn: (evt) => this.handlePressIn(evt, "night"),
                    onPressOut: () => this.setState({ isBoxActive: false }),
                    onResponderMove: (evt) => this.handlePressIn(evt, "night")
                },
                key: `nuit`
            }]

        return (
            <View style={chartsStyle.containerChart}>

                {this.state.isBoxActive &&
                    <View
                        style={[chartsStyle.flyingBox,
                        { left: this.state.posBox.x, top: this.state.posBox.y - 20 }]}>
                        <Text style={chartsStyle.flyingBoxText}>{text}</Text>
                    </View>
                }

                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance parcourue
                        <Text style={[generalStyle.boldText, { color: '#9e95de' }]}> le jour </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: '#856ceb' }]}> la nuit</Text>.
                    </Text>
                </View>

                <PieChart
                    style={{ flex: 1 }}
                    data={pieData}
                    innerRadius="40%"
                />

            </View>
        )
    }
}

export class DistOneDay extends React.Component {

    state = {
        isBoxActive: false,
        posBox: { x: undefined },
        data: undefined,
        label: undefined
    };


    componentDidMount() {
        let dataDist = distribDistOneDay(this.props.rides);

        let data = dataDist[0];
        let labels = dataDist[1];
        this.setState({ data: data, labels: labels });

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }

    handlePressIn(evt) {
        let x = evt.nativeEvent.locationX;
        this.setState({
            isBoxActive: true,
            posBox: { x: x }
        })
    }

    getBar() {
        let xBar;
        if (this.state.isBoxActive) {
            let labels = this.state.labels;
            let xmax = labels[labels.length - 1];
            xBar = xmax * (this.state.posBox.x) / (width - 40);
        }

        let decal = 0;
        if (this.state.posBox.x > width - 100) {
            decal = 90
        }

        return { xBar: xBar, decal: decal }
    }
    render() {


        if (this.state.data == undefined) {
            return <View />
        }

        let data = this.state.data;
        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;

        return (
            <View style={chartsStyle.containerChart}>
                <View style={chartsStyle.chartTitleText}>
                    <Text style={chartsStyle.chartTitleText}>
                        Nombre de
                        <Text style={[generalStyle.boldText, { color: "rgba(100, 217, 237,0.8)" }]}> kilomètres parcourus </Text>
                        en une journée.
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <AreaChart
                        style={{ flex: 1 }}
                        data={data}
                        contentInset={{ top: 20, }}
                        svg={{ fill: 'rgba(100, 217, 237,0.8)', }}
                        curve={shape.curveNatural}
                    >
                        <Svg>
                            <Rect
                                height={height}
                                width={width}
                                onPressIn={(evt) => this.handlePressIn(evt)}
                                onPressOut={() => this.setState({ isBoxActive: false })}
                                onResponderMove={(evt) => this.handlePressIn(evt)}
                            />
                            {this.state.isBoxActive &&
                                <Line x1={this.state.posBox.x}
                                    y1="0"
                                    x2={this.state.posBox.x}
                                    y2={height - 20} stroke="rgba(100, 217, 237,0.8)" strokeWidth="3" />
                            }
                            {this.state.isBoxActive &&
                                <View style={[chartsStyle.flyingBox,
                                {
                                    width: 80,
                                    left: this.state.posBox.x + 5 - decal,
                                    top: 10
                                }]}>
                                    <Text style={chartsStyle.flyingBoxText}>{Math.round(xBar) + " km"}</Text>
                                </View>
                            }

                        </Svg>
                    </AreaChart>
                </View>
            </View>
        )
    }
}

export class CumulDist extends React.Component {
    state = {
        isBoxActive: false,
        posBox: { x: undefined },
        data: undefined,
        yval: undefined,
        labels: undefined,
    };

    componentDidMount() {
        let dataDist = evolDist(this.props.rides);

        let cumulElec = dataDist[0];
        let cumulMeca = dataDist[1];

        let labels = dataDist[5];

        let nMonths = cumulElec.length;

        let dataCumul = [];
        let yval = [];
        for (let i = 0; i < nMonths; i++) {
            dataCumul.push({
                label: labels[i],
                meca: cumulMeca[i],
                elec: cumulElec[i],
            })
            yval.push(cumulElec[i] + cumulMeca[i]);
        }

        this.setState({ data: dataCumul, yval: yval, labels: labels })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }


    handlePressIn(evt) {
        let x = evt.nativeEvent.locationX;
        this.setState({
            isBoxActive: true,
            posBox: { x: x }
        })
    }

    getBar() {
        let monthBar;
        if (this.state.isBoxActive) {
            let labels = this.state.labels;
            let index = Math.round((labels.length - 1) * (this.state.posBox.x) / (width - 106))
            monthBar = labels[index];
        }

        let decal = 0;
        if (this.state.posBox.x > width - 106 - 80) {
            decal = 90
        }

        return { monthBar: monthBar, decal: decal }

    }


    render() {

        if (this.state.data == undefined) { return <View /> }

        let dataCumul = this.state.data;
        let yval = this.state.yval;
        let bulle = this.getBar();
        let monthBar = bulle.monthBar;
        let decal = bulle.decal;

        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance cumulée en vélo
                        <Text style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={generalStyle.classicRow}>
                    <YAxis
                        data={yval}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{
                            fill: '#ddd',
                            fontSize: 12,
                        }}
                        style={{ width: 50 }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value} km`}
                    />
                    <View style={{ flex: 1 }}>
                        <StackedAreaChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={dataCumul}
                            keys={["meca", "elec"]}
                            contentInset={{ top: 20, bottom: 20 }}
                            colors={[colorMeca, colorElec]}
                            curve={shape.curveNatural}
                            numberOfTicks={5}
                            animate={true}
                            animationDuration={1000}
                        >
                            <Svg>
                                <Rect
                                    height={height}
                                    width={width}
                                    onPressIn={(evt) => this.handlePressIn(evt)}
                                    onPressOut={() => this.setState({ isBoxActive: false })}
                                    onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <Line x1={this.state.posBox.x}
                                        y1="0"
                                        x2={this.state.posBox.x}
                                        y2={height - 20}
                                        stroke={colorMeca}
                                        strokeWidth="3" />
                                }

                                {this.state.isBoxActive &&
                                    <View style={[
                                        chartsStyle.flyingBox,
                                        { width: 80, left: this.state.posBox.x + 5 - decal, top: 10 }]}>
                                        <Text style={chartsStyle.flyingBoxText}>{monthBar}</Text>
                                    </View>
                                }

                            </Svg>
                            <Grid svg={gridSvg} />
                        </StackedAreaChart>
                    </View>
                </View>
            </View>
        )
    }
}

export class DistRides extends React.Component {

    state = {
        isBoxActive: false,
        posBox: { x: undefined },
        data: undefined
    };

    componentDidMount() {
        let dataDist = distribDist(this.props.rides);

        let speedElec = dataDist[0];
        let speedMeca = dataDist[1];

        let labels = dataDist[2];
        let nMonths = speedElec.length;

        let data = [];
        for (let i = 0; i < nMonths; i++) {
            data.push({
                label: labels[i],
                meca: speedMeca[i],
                elec: speedElec[i],
            })
        }
        this.setState({ data: data, labels: labels });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }


    handlePressIn(evt) {
        let x = evt.nativeEvent.locationX;
        this.setState({
            isBoxActive: true,
            posBox: { x: x }
        })
    }


    getBar() {
        let xBar;
        if (this.state.isBoxActive) {
            let labels = this.state.labels;
            let xmax = labels[labels.length - 1];
            xBar = xmax * (this.state.posBox.x) / (width - 40);
        }

        let decal = 0;
        if (this.state.posBox.x > width - 100) {
            decal = 90
        }

        return { xBar: xBar, decal: decal }
    }



    render() {

        if (this.state.data == undefined) { return <View /> }

        let data = this.state.data;
        let labels = this.state.labels;
        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;


        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance par trajet en vélo
                        <Text
                            style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text
                            style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={generalStyle.classic}>
                    <StackedAreaChart
                        style={{ flex: 1 }}
                        data={data}
                        keys={["meca", "elec"]}
                        contentInset={{ top: 20, bottom: 20 }}
                        colors={[colorMeca, colorElec]}
                        curve={shape.curveNatural}
                        numberOfTicks={5}
                        animate={true}
                        animationDuration={1000}
                    >
                        <Svg>
                            <Rect
                                height={height}
                                width={width}
                                onPressIn={(evt) => this.handlePressIn(evt)}
                                onPressOut={() => this.setState({ isBoxActive: false })}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />

                            {this.state.isBoxActive &&
                                <Line x1={this.state.posBox.x}
                                    y1="0"
                                    x2={this.state.posBox.x}
                                    y2={height - 20}
                                    stroke={colorMeca}
                                    strokeWidth="3"
                                />
                            }
                            {this.state.isBoxActive &&
                                <View style={
                                    [chartsStyle.flyingBox,
                                    { width: 80, left: this.state.posBox.x + 5 - decal, top: 10 }]}>
                                    <Text style={chartsStyle.flyingBoxText}>{Math.round(10 * xBar) / 10 + " km"}</Text>
                                </View>
                            }

                        </Svg>
                    </StackedAreaChart>
                </View>
            </View>
        )
    }
}

export class HourDist extends React.Component {

    state = {
        isBoxActive: false,
        currentBox: undefined,
        posBox: { x: undefined, y: undefined }
    };

    componentDidMount() {
        let dataDist = distribDistHour(this.props.rides);

        let distElec = dataDist[1];
        let distMeca = dataDist[2];

        let nDay = distElec.length;


        let data = [];
        let yval = [];

        for (let i = 0; i < nDay; i++) {
            let opacity = 0.7;
            data.push({
                meca: {
                    value: distMeca[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity})`
                    }
                },
                elec: {
                    value: distElec[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity / 2})`
                    }
                }

            })
            yval.push(distElec[i] + distMeca[i]);
        }

        this.setState({ data: data, yval: yval, distElec: distElec, distMeca: distMeca })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }



    handlePressIn(evt, index) {
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({
            isBoxActive: true,
            currentBox: index,
            posBox: { x: x, y: y }
        })
    }


    getBar() {
        let xBar;
        if (this.state.isBoxActive) {
            xBar = 23 * (this.state.posBox.x) / (width - 106);
            xBar = Math.round(xBar);
        }

        let decal = 0;
        if (this.state.posBox.x > width - 220) {
            decal = 140
        }

        return { xBar: xBar, decal: decal }
    }
    render() {

        if (this.state.data == undefined) { return <View /> }

        let data = this.state.data;
        let yval = this.state.yval;
        let nDay = data.length;


        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;

        for (let i = 0; i < nDay; i++) {
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i) {
                opacity = 0.4;
            }
            data[i].meca.svg = { fill: `rgba(99, 230, 219,${opacity})` };
            data[i].elec.svg = { fill: `rgba(99, 230, 219,${opacity / 2})` };
        }
        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance par heure du jour en vélo
                        <Text style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={generalStyle.classicRow}>
                    <YAxis
                        style={{ width: 50 }}
                        data={yval}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{ fill: '#ddd', fontSize: 12 }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value} km`}
                    />
                    <View style={generalStyle.classic}>
                        <StackedBarChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={data}
                            keys={["meca", "elec"]}
                            contentInset={{ top: 20, bottom: 10 }}
                            valueAccessor={({ item, key }) => item[key].value}
                            colors={["", ""]}
                            curve={shape.curveNatural}
                            numberOfTicks={5}
                            animate={true}
                            animationDuration={1000}
                        >
                            <Svg>
                                <Rect
                                    height={height}
                                    width={width}
                                    onPressIn={(evt) => this.handlePressIn(evt)}
                                    onPressOut={() => this.setState({ isBoxActive: false })}
                                    onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <View style={
                                        [chartsStyle.flyingBox,
                                        {
                                            width: 120,
                                            left: this.state.posBox.x + 5 - decal,
                                            top: this.state.posBox.y - 100
                                        }]}>
                                        <Text style={chartsStyle.flyingBoxText}>
                                            {xBar + "h : " + (Math.round(this.state.distMeca[xBar] + this.state.distElec[xBar])) + " km\n"}(
                                            <Text style={[generalStyle.boldText, { color: colorMeca }]}>
                                                {Math.round(this.state.distMeca[xBar])}
                                            </Text> +
                                            <Text style={[generalStyle.boldText, { color: colorElec }]}>
                                                {Math.round(this.state.distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>

                            <Grid svg={gridSvg} />
                        </StackedBarChart>
                        <XAxis
                            data={data}
                            formatLabel={(value, index) => { if (value % 3 == 0) { return value + "h" } }}
                            svg={{ fontSize: 10, fill: '#ddd' }}
                            contentInset={{ left: 20, right: 5 }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export class DayDist extends React.Component {

    state = {
        isBoxActive: false,
        currentBox: undefined,
        posBox: { x: undefined, y: undefined },
        data: undefined
    };

    componentDidMount() {
        let dataDist = distribDistDay(this.props.rides);

        let distElec = dataDist[1];
        let distMeca = dataDist[2];

        let labels = dataDist[0];
        let nDays = distElec.length;

        let data = [];
        let yval = [];
        for (let i = 0; i < nDays; i++) {
            let opacity = 0.7;
            data.push({
                meca: {
                    value: distMeca[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity})`
                    }
                },
                elec: {
                    value: distElec[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity / 2})`
                    }
                }

            })
            yval.push(distElec[i] + distMeca[i]);
        }
        this.setState({ yval: yval, data: data, distElec: distElec, labels: labels, distMeca: distMeca });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }


    handlePressIn(evt, index) {
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({
            isBoxActive: true,
            currentBox: index,
            posBox: { x: x, y: y }
        });
    }


    getBar() {
        let xBar;
        let data = this.state.data;
        let nDays = data.length;
        if (this.state.isBoxActive) {
            xBar = (nDays - 1) * (this.state.posBox.x) / (width - 106);
            xBar = Math.round(xBar);
        }
        let decal = 0;
        if (this.state.posBox.x > width - 220) {
            decal = 140
        }
        return { xBar: xBar, decal: decal }
    }

    render() {

        if (this.state.data == undefined) { return <View /> }

        let data = this.state.data;
        let yval = this.state.yval;
        let labels = this.state.labels;
        let nDays = data.length;




        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;

        for (let i = 0; i < nDays; i++) {
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i) {
                opacity = 0.4;
            }
            data[i].meca.svg = { fill: `rgba(99, 230, 219,${opacity})` };
            data[i].elec.svg = { fill: `rgba(99, 230, 219,${opacity / 2})` };
        }

        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance par jour de la semaine en vélo
                        <Text style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={generalStyle.classicRow}>
                    <YAxis
                        style={{ width: 50 }}
                        data={yval}
                        contentInset={{ top: 20, bottom: 60 }}
                        svg={{ fill: '#ddd', fontSize: 12 }}
                        numberOfTicks={10}
                        min={0}
                        formatLabel={(value) => `${value} km`}
                    />
                    <View style={{ flex: 1 }}>
                        <StackedBarChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={data}
                            keys={["meca", "elec"]}
                            contentInset={{ top: 20, bottom: 10 }}
                            colors={['', '']}
                            curve={shape.curveNatural}
                            numberOfTicks={5}
                            valueAccessor={({ item, key }) => item[key].value}
                            animate={true}
                            animationDuration={1000}
                        >
                            <Svg>
                                <Rect
                                    height={height}
                                    width={width}
                                    onPressIn={(evt) => this.handlePressIn(evt)}
                                    onPressOut={() => this.setState({ isBoxActive: false })}
                                    onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <View style={
                                        [chartsStyle.flyingBox,
                                        {
                                            width: 120,
                                            left: this.state.posBox.x + 5 - decal,
                                            top: this.state.posBox.y - 100
                                        }]}>
                                        <Text style={chartsStyle.flyingBoxText}>
                                            {labels[xBar] + " :\n" + (Math.round(this.state.distMeca[xBar] + this.state.distElec[xBar])) + " km\n"}(
                                            <Text style={[generalStyle.boldText, { color: colorMeca }]}>
                                                {Math.round(this.state.distMeca[xBar])}
                                            </Text>
                                            +
                                            <Text style={[generalStyle.boldText, { color: colorElec }]}>
                                                {Math.round(this.state.distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>

                            <Grid
                                svg={gridSvg}

                            />
                        </StackedBarChart>
                        <XAxis
                            style={{ marginLeft: 16, height: 50 }}
                            data={data}
                            formatLabel={(value, index) => labels[index].slice(0, 3)}
                            contentInset={{ left: 20, right: 20 }}
                            svg={{ fontSize: 13, fill: '#ddd' }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export class MonthDist extends React.Component {

    state = {
        isBoxActive: false,
        currentBox: undefined,
        posBox: { x: undefined, y: undefined },
        data: undefined
    };

    componentDidMount() {
        let dataDist = evolDist(this.props.rides);

        let distElec = dataDist[3];
        let distMeca = dataDist[4];

        let labels = dataDist[5].slice(1);
        let nMonths = distElec.length;
        let data = [];
        let yval = [];
        for (let i = 0; i < nMonths; i++) {
            let opacity = 0.7;
            data.push({
                meca: {
                    value: distMeca[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity})`
                    }
                },
                elec: {
                    value: distElec[i], svg: {
                        fill: `rgba(99, 230, 219,${opacity / 2})`
                    }
                }

            })
            yval.push(distElec[i] + distMeca[i]);
        }

        this.setState({ data: data, labels: labels, distElec: distElec, distMeca: distMeca, yval: yval })

    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState != this.state;
    }



    handlePressIn(evt, index) {
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({
            isBoxActive: true,
            currentBox: index,
            posBox: { x: x, y: y }
        })
    }

    getBar() {
        let data = this.state.data;
        let nMonths = data.length;

        let xBar;
        if (this.state.isBoxActive) {
            xBar = (nMonths - 1) * (this.state.posBox.x) / (width - 100);
            xBar = Math.round(xBar);
            xBar = Math.min(xBar, nMonths - 1);
        }
        let decal = 0;
        if (this.state.posBox.x > width - 220) {
            decal = 140
        }
        return { xBar: xBar, decal: decal }
    }

    render() {

        if (this.state.data == undefined) { return <View /> }

        let data = this.state.data;
        let yval = this.state.yval;
        let labels = this.state.labels;
        let nMonths = data.length;
        let bulle = this.getBar();
        let xBar = bulle.xBar;
        let decal = bulle.decal;

        for (let i = 0; i < nMonths; i++) {
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i) {
                opacity = 0.4;
            }
            data[i].meca.svg = { fill: `rgba(99, 230, 219,${opacity})` };
            data[i].elec.svg = { fill: `rgba(99, 230, 219,${opacity / 2})` };
        }



        return (
            <View style={chartsStyle.containerChart}>
                <View>
                    <Text style={chartsStyle.chartTitleText}>
                        Distance par mois en vélo
                        <Text style={[generalStyle.boldText, { color: colorMeca }]}> mécanique </Text>
                        et
                        <Text style={[generalStyle.boldText, { color: colorElec }]}> électrique</Text>.
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <YAxis
                        data={yval}
                        contentInset={{ top: 20, bottom: 10 }}
                        svg={{ fill: '#ddd', fontSize: 12 }}
                        numberOfTicks={10}
                        min={0}
                        formatLabel={(value) => `${value} km`}
                    />
                    <View style={generalStyle.classic}>
                        <StackedBarChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={data}
                            keys={["meca", "elec"]}
                            contentInset={{ top: 20, bottom: 10 }}
                            valueAccessor={({ item, key }) => item[key].value}
                            colors={["", ""]}
                            numberOfTicks={5}
                            animate={true}
                            animationDuration={1000}
                        >
                            <Svg>
                                <Rect
                                    height={height}
                                    width={width}
                                    onPressIn={(evt) => this.handlePressIn(evt)}
                                    onPressOut={() => this.setState({ isBoxActive: false })}
                                    onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <View style={
                                        [chartsStyle.flyingBox,
                                        {
                                            width: 120,
                                            left: this.state.posBox.x + 5 - decal,
                                            top: this.state.posBox.y - 100
                                        }]}>
                                        <Text style={chartsStyle.flyingBoxText}>
                                            {labels[xBar] + " :\n" + (Math.round(this.state.distMeca[xBar] + this.state.distElec[xBar])) + " km\n"}(
                                            <Text style={[generalStyle.boldText, { color: colorMeca }]}>
                                                {Math.round(this.state.distMeca[xBar])}
                                            </Text>
                                            +
                                            <Text style={[generalStyle.boldText, { color: colorElec }]}>
                                                {Math.round(this.state.distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>
                            <Grid svg={gridSvg} />
                        </StackedBarChart>
                    </View>
                </View>
            </View>
        )
    }
}

export class StationChart extends React.Component {
    state = {
        data: undefined,
        station: this.props.station
    };

    getData() {
        fetchStationInfos(this.props.station.id_station)
            .then((res) => {
                let my_data = res.data;
                let ebike = my_data.ebike;
                let meca = my_data.meca;
                let n = ebike.length;
                let data = [];
                let yval = [];

                for (let i = 0; i < n; i++) {

                    data.push({
                        elec: ebike[i],
                        meca: meca[i],
                        other: this.state.station.capacity-meca[i]-ebike[i]
                    });
                    yval.push(ebike[i]+meca[i]);

                }
                this.setState({ data: data, yval: yval });
            })
            .catch()
    }
    componentDidMount() {
        this.getData();

    }



    render() {
        if (this.state.data == undefined) {
            return <View />
        }




        return <View style={{ margin: 5, flex: 1 }}>

            <View style={generalStyle.classicRow}>
                <YAxis
                    data={this.state.yval}
                    max={this.state.station.capacity}
                    min={0}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{
                        fill: '#ddd',
                        fontSize: 12,
                    }}
                    style={{ width: 30 }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}`}
                /><StackedAreaChart
                    style={{ flex: 1 }}
                    data={this.state.data}
                    keys={["meca", "elec","other"]}
                    contentInset={{ top: 20, bottom: 20 }}
                    colors={[colorMeca, colorElec,"rgba(0,0,0,0)"]}
                    curve={shape.curveMonotoneX}
                    numberOfTicks={5}
                    animate={true}
                    animationDuration={1000}
                >
                    <Grid svg={{
                        stroke: "#bbb",
                        strokeOpacity: 0.2,
                        strokeWidth: 1
                    }} />
                </StackedAreaChart>
            </View></View>

    }


}
