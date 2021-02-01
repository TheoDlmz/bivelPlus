import * as React from 'react';
import { Text, View, StyleSheet, Dimensions} from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { StackedAreaChart , Grid, XAxis, YAxis, StackedBarChart, AreaChart, PieChart} from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import{ evolDist, distribDistHour, distribSpeed, distribDistDay, 
    jourNuit, distribDistOneDay, distribDist} from '../utils/graphFunctions' 

const { width, height } = Dimensions.get("window");

const colorMeca = 'rgba(99, 230, 219, 0.7)';
const colorElec = 'rgba(99, 230, 219, 0.4)';

export class Speed extends React.Component{

    state={
        isBoxActive:false,
        posBox:{x:undefined}
    };
    

    handlePressIn(evt){
        let x = evt.nativeEvent.locationX;
        this.setState({isBoxActive:true,
            posBox:{x:x}})
    }

    
    render(){

        const dataDist = distribSpeed(this.props.rides);

        const speedElec = dataDist[0];
        const speedMeca = dataDist[1];
        
        const labels = dataDist[2];

        const nMonths = speedElec.length;

        let data = [];
        for (let i =0;i < nMonths; i++){
            data.push({
                label:labels[i],
                meca:speedMeca[i],
                elec:speedElec[i]-speedMeca[i],
            })
        }

        let xBar;
        if (this.state.isBoxActive){
            let xmax = labels[labels.length-1];
            xBar = xmax*(this.state.posBox.x)/(width-40);
        }   

        let decal = 0;
        if (this.state.posBox.x > width-100){
            decal = 90
        }

        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Vitesse moyenne en vélo
                        <Text style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>  
                    <View style={{flex:1}}>
                        <StackedAreaChart
                            style={{ flex:1}}
                            data={data}
                            keys={["meca","elec"]}
                            contentInset={{top: 20}}
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
                                    onPressOut={() =>  this.setState({isBoxActive:false})}
                                    onResponderMove={(evt) => this.handlePressIn(evt)} 
                                />

                                {this.state.isBoxActive &&
                                    <Line 
                                        x1={this.state.posBox.x} 
                                        y1="0" 
                                        x2={this.state.posBox.x} 
                                        y2={height-20}
                                        stroke={colorMeca} 
                                        strokeWidth="3"
                                    />   
                                }
                                {this.state.isBoxActive &&
                                    <View style={[
                                        styles.flyingBox,
                                        {width:80,
                                        left:this.state.posBox.x+5-decal,
                                        top:10
                                        }]}>
                                        <Text style={styles.flyingBoxText}>
                                            {Math.round(xBar)+ " km/h"}
                                        </Text>
                                    </View>
                                }
                
                            </Svg>
                        </StackedAreaChart>    
                    </View>
                </View>
            </View>
        )
    }
}

export class Night extends React.Component{

    state={
        isBoxActive:false,
        quarterBox:undefined,
        posBox:{x:undefined,y:undefined}
    };
    

    handlePressIn(evt, type){
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        x = Math.min(x,width-160);
        this.setState({isBoxActive:true,
            quarterBox:type,
            posBox:{x:x,y:y}})
    }

    render(){
        const dataDist = jourNuit(this.props.rides);

        const jour = dataDist[0];
        const nuit = dataDist[1];

        let opacityNight = 1;
        let opacityDay = 1;
        let text;

        if (this.state.isBoxActive){
            if (this.state.quarterBox == "day"){
                opacityNight = 0.3;
                text = Math.round(jour)+" km parcourus le jour";
            }else if(this.state.quarterBox == "night"){
                opacityDay = 0.3;
                text = Math.round(nuit)+" km parcourus la nuit";
            }
        }

        const pieData = [
            {value:jour, 
            svg:{
                fill:"#9e95de",
                opacity: opacityDay,
                onPressIn: (evt) => this.handlePressIn(evt,"day"),
                onPressOut: () =>  this.setState({isBoxActive:false}),
                onResponderMove: (evt) => this.handlePressIn(evt,"day")
                }, 
            key: `jour`},
            {value:nuit, 
            svg:{
                fill:"#856ceb",
                opacity:opacityNight,
                onPressIn: (evt) => this.handlePressIn(evt,"night"),
                onPressOut: () =>  this.setState({isBoxActive:false}),
                onResponderMove: (evt) => this.handlePressIn(evt,"night")
                }, 
            key: `nuit`}]
          
        return (
            <View style={styles.containerChart}>

                {this.state.isBoxActive &&
                    <View 
                        style={[styles.flyingBox,
                            {left:this.state.posBox.x,top:this.state.posBox.y-20}]}>
                        <Text style={styles.flyingBoxText}>{text}</Text>
                    </View>
                }

                <View style={{justifyContent:"center",  zIndex: 2}}>
                    <Text style={styles.titleOfChart}>
                        Distance parcourue
                        <Text style={{color:'#9e95de',  fontWeight:"bold"}}> le jour </Text>
                        et
                        <Text style={{color:'#856ceb', fontWeight:"bold"}}> la nuit</Text>.
                    </Text>
                </View>

                <PieChart 
                    style={{flex:1}} 
                    data={pieData} 
                    innerRadius="40%" 
                />

            </View>
        )
    }
}

export class DistOneDay extends React.Component{

    state={
        isBoxActive:false,
        posBox:{x:undefined}
    };
    

    handlePressIn(evt){
        let x = evt.nativeEvent.locationX;
        this.setState({isBoxActive:true,
            posBox:{x:x}})
    }

    
    render(){
        const dataDist = distribDistOneDay(this.props.rides);

        const data = dataDist[0];
        const labels = dataDist[1];

        let xBar;
        if (this.state.isBoxActive){
            let xmax = labels[labels.length-1];
            xBar = xmax*(this.state.posBox.x)/(width-40);
        }   

        let decal = 0;
        if (this.state.posBox.x > width-100){
            decal = 90
        }
    
        return (
            <View style={styles.containerChart}>
                <View style={styles.titleChart}>
                    <Text style={styles.titleOfChart}>
                        Nombre de
                        <Text style={styles.kmBold}> kilomètres parcourus </Text>
                        en une journée.
                    </Text>
                </View>
                <View style={{flex:1}}>
                    <AreaChart
                        style={{ flex:1}}
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
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} 
                            />
                            {this.state.isBoxActive &&
                                <Line x1={this.state.posBox.x} 
                                y1="0" 
                                x2={this.state.posBox.x} 
                                y2={height-20} stroke="rgba(100, 217, 237,0.8)" strokeWidth="3" />
                                
                            }
                            {this.state.isBoxActive &&
                                <View style={[styles.flyingBox,
                                    {width:80,
                                    left:this.state.posBox.x+5-decal,
                                    top:10}]}>
                                    <Text style={styles.flyingBoxText}>{Math.round(xBar)+ " km"}</Text>
                                </View>
                            }
        
                        </Svg>
                    </AreaChart>
                </View>
            </View>
        )
    }
}

export class CumulDist extends React.Component{
    state={
        isBoxActive:false,
        posBox:{x:undefined}
    };
    
    handlePressIn(evt){
        let x = evt.nativeEvent.locationX;
        this.setState({isBoxActive:true,
            posBox:{x:x}})
    }

    render() {
        const dataDist = evolDist(this.props.rides);

        const cumulElec = dataDist[0];
        const cumulMeca = dataDist[1];

        const labels = dataDist[5];

        const nMonths = cumulElec.length;

        let dataCumul = [];
        let yval = [];
        for (let i =0;i < nMonths; i++){
            dataCumul.push({
                label:labels[i],
                meca:cumulMeca[i],
                elec:cumulElec[i],
            })
            yval.push(cumulElec[i]+cumulMeca[i]);
        }

        let monthBar;
        if (this.state.isBoxActive){
            let index = Math.round((labels.length-1)*(this.state.posBox.x)/(width-106))
            monthBar = labels[index];
        }   

        let decal = 0;
        if (this.state.posBox.x > width-106-80){
            decal = 90
        }

    
        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Distance cumulée en vélo
                        <Text style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    <YAxis
                        data={yval}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{
                            fill: '#ddd',
                            fontSize: 12,
                        }}
                        style={{width:50}}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value} km`}
                    />   
                    <View style={{flex:1}}>
                        <StackedAreaChart
                            style={{ flex:1,marginLeft: 16 }}
                            data={dataCumul}
                            keys={["meca","elec"]}
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
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <Line x1={this.state.posBox.x} 
                                    y1="0" 
                                    x2={this.state.posBox.x} 
                                    y2={height-20} 
                                    stroke={colorMeca}
                                    strokeWidth="3" /> 
                                }

                                {this.state.isBoxActive &&
                                    <View style={[
                                        styles.flyingBox,
                                        {width:80,left:this.state.posBox.x+5-decal,top:10}]}>
                                        <Text style={styles.flyingBoxText}>{monthBar}</Text>
                                    </View>
                                }
            
                            </Svg>
                            <Grid
                            svg={{
                                stroke:"#bbb", 
                                strokeOpacity:0.2,
                                strokeWidth:3}}
    
                            />
                        </StackedAreaChart>
                    </View>
                </View>
            </View>
        )
    }
}

export class DistRides extends React.Component{

    state={
        isBoxActive:false,
        posBox:{x:undefined}
    };

    handlePressIn(evt){
        let x = evt.nativeEvent.locationX;
        this.setState({isBoxActive:true,
            posBox:{x:x}})
    }

    render() {
        const dataDist = distribDist(this.props.rides);

        const speedElec = dataDist[0];
        const speedMeca = dataDist[1];

        const labels = dataDist[2];
        const nMonths = speedElec.length;

        let data = [];
        for (let i =0;i < nMonths; i++){
            data.push({
                label:labels[i],
                meca:speedMeca[i],
                elec:speedElec[i],
            })
        }

        let xBar;
        if (this.state.isBoxActive){
            let xmax = labels[labels.length-1];
            xBar = xmax*(this.state.posBox.x)/(width-40);
        }   

        let decal = 0;
        if (this.state.posBox.x > width-100){
            decal = 90
        }
        

        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Distance par trajet en vélo
                        <Text 
                        style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text 
                        style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    <View style={{flex:1}}>
                        <StackedAreaChart
                            style={{ flex:1}}
                            data={data}
                            keys={["meca","elec"]}
                            contentInset={{ top: 20, bottom: 20 }}
                            colors={[colorMeca,colorElec]}
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
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <Line x1={this.state.posBox.x} 
                                    y1="0" 
                                    x2={this.state.posBox.x} 
                                    y2={height-20} 
                                    stroke={colorMeca} 
                                    strokeWidth="3"
                                    />
                                    
                                }
                                {this.state.isBoxActive &&
                                    <View style={
                                        [styles.flyingBox,
                                        {width:80,left:this.state.posBox.x+5-decal,top:10}]}>
                                        <Text style={styles.flyingBoxText}>{Math.round(10*xBar)/10+" km"}</Text>
                                    </View>
                                }
        
                            </Svg>
                        </StackedAreaChart>
                    </View>
                </View>
            </View>
        )
    }
}

export class HourDist extends React.Component{

    state={
        isBoxActive:false,
        currentBox:undefined,
        posBox:{x:undefined, y:undefined}
    };
    
    handlePressIn(evt, index){
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({isBoxActive:true,
            currentBox:index,
            posBox:{x:x,y:y}})
    }

    render(){

        const dataDist = distribDistHour(this.props.rides);

        const distElec = dataDist[1];
        const distMeca = dataDist[2];

        const nDay = distElec.length;

        let xBar;
        if (this.state.isBoxActive){
            xBar = 23*(this.state.posBox.x)/(width-106);
            xBar = Math.round(xBar);
        }   
        
        let data = [];
        let yval = [];
        for (let i =0;i < nDay; i++){
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i){
                opacity = 0.4;
            }
            data.push({
                meca:{value: distMeca[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity})`
                }},
                elec:{value:distElec[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity/2})`
                }}
                
            })
            yval.push(distElec[i]+distMeca[i]);
        }

        let decal = 0;
        if (this.state.posBox.x > width-220){
            decal = 140
        }

        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Distance par heure du jour en vélo
                        <Text style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    <YAxis
                        style={{width:50}}
                        data={yval}
                        contentInset={{ top: 20, bottom: 10 }}
                        svg={{
                            fill: '#ddd',
                            fontSize: 12,
                        }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value} km`}
                    />      
                    <View style={{flex:1}}>
                        <StackedBarChart
                            style={{ flex:1,marginLeft: 16 }}
                            data={data}
                            keys={["meca","elec"]}
                            contentInset={{ top: 20, bottom: 10 }}
                            valueAccessor={({ item, key }) => item[key].value}
                            colors={["",""]}
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
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />
        
                                {this.state.isBoxActive &&
                                    <View style={
                                        [styles.flyingBox,
                                        {width:120,
                                        left:this.state.posBox.x+5-decal,
                                        top:this.state.posBox.y-100}]}>
                                        <Text style={styles.flyingBoxText}>
                                            {xBar+"h : "+(Math.round(distMeca[xBar]+distElec[xBar]))+" km\n"}(
                                            <Text style={styles.boldMeca}>
                                                {Math.round(distMeca[xBar])}
                                            </Text> + 
                                            <Text style={styles.boldElec}>
                                                {Math.round(distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>
                            
                            <Grid
                            svg={{
                                stroke:"#bbb", 
                                strokeOpacity:0.2,
                                strokeWidth:3}}
    
                            />
                        </StackedBarChart>
                        <XAxis
                            style={{ marginLeft:0,marginTop:-10}}
                            data={data}
                            formatLabel={(value, index) =>  data[index].label  }
                            contentInset={{ left: 20, right: 20 }}
                            svg={{ fontSize: 9, fill: 'black'}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export class DayDist extends React.Component{

    state={
        isBoxActive:false,
        currentBox:undefined,
        posBox:{x:undefined, y:undefined}
    };
    
    handlePressIn(evt, index){
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({isBoxActive:true,
            currentBox:index,
            posBox:{x:x,y:y}})
    }

    render(){
        const dataDist = distribDistDay(this.props.rides);

        const distElec = dataDist[1];
        const distMeca = dataDist[2];

        const labels = dataDist[0];
        const nDays = distElec.length;
        
        let xBar;
        if (this.state.isBoxActive){
            xBar = (nDays-1)*(this.state.posBox.x)/(width-106);
            xBar = Math.round(xBar);
        }   

        let data = [];
        let yval = [];
        for (let i =0; i < nDays; i++){
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i){
                opacity = 0.4;
            }
            data.push({
                meca:{value: distMeca[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity})`
                }},
                elec:{value:distElec[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity/2})`
                }}
                
            })
            yval.push(distElec[i]+distMeca[i]);
        }

        let decal = 0;
        if (this.state.posBox.x > width-220){
            decal = 140
        }
    
        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Distance par jour de la semaine en vélo
                        <Text style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    <YAxis
                    style={{width:50}}
                    data={yval}
                    contentInset={{ top: 20, bottom: 60 }}
                    svg={{
                        fill: '#ddd',
                        fontSize: 12,
                    }}
                    numberOfTicks={10}
                    min={0}
                    formatLabel={(value) => `${value} km`}
                    />
                    <View style={{flex:1}}>
                        <StackedBarChart
                            style={{ flex:1,marginLeft: 16 }}
                            data={data}
                            keys={["meca","elec"]}
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
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />
    
                                {this.state.isBoxActive &&
                                    <View style={
                                        [styles.flyingBox,
                                        {width:120,
                                        left:this.state.posBox.x+5-decal,
                                        top:this.state.posBox.y-100}]}>
                                        <Text style={styles.flyingBoxText}>
                                            {labels[xBar]+" :\n"+(Math.round(distMeca[xBar]+distElec[xBar]))+" km\n"}(
                                            <Text style={styles.boldMeca}>
                                                {Math.round(distMeca[xBar])}
                                            </Text>
                                            + 
                                            <Text style={styles.boldElec}>
                                                {Math.round(distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>
                            
                            <Grid
                            svg={{
                                stroke:"#bbb", 
                                strokeOpacity:0.2,
                                strokeWidth:3}}
    
                            />
                        </StackedBarChart>
                        <XAxis
                            style={{ marginLeft:16,height:50}}
                            data={data}
                            formatLabel={(value, index) =>  labels[index].slice(0,3)  }
                            contentInset={{ left: 20, right: 20 }}
                            svg={{ fontSize: 13, fill: '#ddd'}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export class MonthDist extends React.Component{

    state={
        isBoxActive:false,
        currentBox:undefined,
        posBox:{x:undefined, y:undefined}
    };

    handlePressIn(evt, index){
        let x = evt.nativeEvent.locationX;
        let y = evt.nativeEvent.locationY;
        this.setState({isBoxActive:true,
            currentBox:index,
            posBox:{x:x,y:y}})
    }

    render(){
        const dataDist = evolDist(this.props.rides);

        const distElec = dataDist[3];
        const distMeca = dataDist[4];

        const labels = dataDist[5].slice(1);
        const nMonths = distElec.length;
            
        let xBar;
        if (this.state.isBoxActive){
            xBar = (nMonths-1)*(this.state.posBox.x)/(width-100);
            xBar = Math.round(xBar);
            xBar = Math.min(xBar,nMonths-1);
        }

        let data = [];
        let yval = [];
        for (let i =0; i < nMonths; i++){
            let opacity = 0.7;
            if (this.state.isBoxActive && xBar != i){
                opacity = 0.4;
            }
            data.push({
                meca:{value: distMeca[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity})`
                }},
                elec:{value:distElec[i],svg: {
                    fill:`rgba(99, 230, 219,${opacity/2})`
                }}
                
            })
            yval.push(distElec[i]+distMeca[i]);
        }

        let decal = 0;
        if (this.state.posBox.x > width-220){
            decal = 140
        }

        return (
            <View style={styles.containerChart}>
                <View style={{justifyContent:"center"}}>
                    <Text style={styles.titleOfChart}>
                        Distance par mois en vélo
                        <Text style={styles.boldMeca}> mécanique </Text>
                        et
                        <Text style={styles.boldElec}> électrique</Text>.
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    <YAxis
                        data={yval}
                        contentInset={{ top: 20, bottom: 10 }}
                        svg={{
                            fill: '#ddd',
                            fontSize: 12,
                        }}
                        numberOfTicks={10}
                        min={0}
                        formatLabel={(value) => `${value} km`}
                    />
                    <View style={{flex:1}}>
                        <StackedBarChart
                            style={{ flex:1,marginLeft: 16 }}
                            data={data}
                            keys={["meca","elec"]}
                            contentInset={{ top: 20, bottom: 10 }}
                            valueAccessor={({ item, key }) => item[key].value}
                            colors={["",""]}
                            numberOfTicks={5}
                            animate={true}
                            animationDuration={1000}
                        >
                            <Svg>
                                <Rect
                                height={height}
                                width={width}
                                onPressIn={(evt) => this.handlePressIn(evt)}
                                onPressOut={() =>  this.setState({isBoxActive:false})}
                                onResponderMove={(evt) => this.handlePressIn(evt)} />

                                {this.state.isBoxActive &&
                                    <View style={
                                        [styles.flyingBox,
                                        {width:120,
                                        left:this.state.posBox.x+5-decal,
                                        top:this.state.posBox.y-100}]}>
                                        <Text style={styles.flyingBoxText}>
                                            {labels[xBar]+" :\n"+(Math.round(distMeca[xBar]+distElec[xBar]))+" km\n"}(
                                            <Text style={styles.boldMeca}>
                                                {Math.round(distMeca[xBar])}
                                            </Text>
                                            + 
                                            <Text style={styles.boldElec}>
                                                {Math.round(distElec[xBar])}
                                            </Text>)
                                        </Text>
                                    </View>
                                }
                            </Svg>
                            
                            <Grid
                            svg={{
                                stroke:"#bbb", 
                                strokeOpacity:0.2,
                                strokeWidth:3}}
    
                            />
                        </StackedBarChart>
                    </View>
                </View>
            </View>
        )
    } 
}

const styles = StyleSheet.create({
    containerChart:{ 
        flex:1,
         padding: 20, 
         paddingBottom:30, 
         alignItems:"stretch" 
    },
    flyingBox:{
        position:"absolute", 
        zIndex: 1,
        padding:10,
        backgroundColor:'rgba(40, 28, 89,0.6)',
        borderRadius:10,
        width:150,
        justifyContent:"center",
        alignItems:"center"
    },
    titleChart:{
        justifyContent:"center",
        height:50,
    },
    titleOfChart:
    {fontSize:20, 
    color:"#ddd",
    textAlign:"center"},

    boldMeca:{
        color:colorMeca,
        fontWeight:"bold"
    },
    boldElec:{
        color:colorElec, 
        fontWeight:"bold"
    },
    kmBold:{
        color:'rgba(100, 217, 237,0.8)', 
        fontWeight:"bold"
    },
    flyingBoxText:{
        textAlign:"center",
        color:"#ddd"}

}
);