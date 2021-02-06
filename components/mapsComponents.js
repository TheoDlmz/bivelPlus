import React, { Component } from "react";
import { View, Text } from "react-native";
import { Polyline, Marker } from 'react-native-maps';
import { sleep } from '../utils/miscellaneous'

import { mapStyle } from '../style/mapStyle'

const interpolate = require('color-interpolate');

// Pour afficher les trajets animés
export class AnimatedPolyline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      coords: []
    };
  }
  componentDidMount() {
    sleep(this.props.delay).then(
      () =>
        this._animate(this.props.coordinates));
  }

  clean() {
    const self = this;
    this.setState({ coords: [] })

  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.coordinates!==this.props.coordinates){
      this._animate([]);
      sleep(this.props.delay).then(
        () =>
          this._animate(nextProps.coordinates));
      }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.coords.length !== this.state.coords.length) {
      return true;
    }
    return false;
  }
  _animate(allCoords) {
    const self = this;
    const len = allCoords.length;
    let completed = 0;
    this.state.coords = [];
    const steps = parseInt((allCoords.length / 20), 10);
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const coords = this.state.coords.slice(0);
      for (let i = completed; i < (completed + steps) && i <= len; i += 1) {
        if (allCoords[i]) {
          coords.push(allCoords[i]);
        }
      }
      self.setState({ coords });
      if (completed >= len) {
        clearInterval(self.interval);
      }
      completed += steps;
    }, (this.props.interval || 10));
  }
  render() {
    return (
      <Polyline
        {...this.props}
        coordinates={[...this.state.coords]}
      />
    );
  }
}

export class MarkerStation extends Component {

  state = {
    station: this.props.station
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props != nextProps;
  }

  render() {
    let station = this.state.station;
    let lat = station.geo[0];
    let lon = station.geo[1];
    let w = 0;
    let text = "?";
    let colormap;
  
    if (this.props.type == 0){
      w = Math.min(1, (station.ebike + station.meca) / 20);
      text = station.meca + '|' + station.ebike;
      colormap =  interpolate(['#eb290c', '#ebd10c', '#27b32c']);
    }else if (this.props.type == 1){
      w = Math.min(1, (station.capacity - (station.ebike + station.meca)) / 10)
      text  = station.capacity - (station.ebike + station.meca);
      colormap =  interpolate(['#eb290c', '#5c55bd']);
    }else{
      colormap =  interpolate(['#eb290c', '#c47123', '#ebd10c']);

    }
    let color = colormap(w);
    return (<Marker
      coordinate={{
        latitude: lat,
        longitude: lon,
      }}
      key={station.id_bivel}
      tracksViewChanges={false}
      anchor={{ x: .5, y: .5 }}
      onPress={this.props.onPress}
    >
      <View
        style={[mapStyle.markerView, {backgroundColor: color }]}
      >
        <Text style={{ color: "white" }}>
          {text}
        </Text>
      </View>
    </Marker>)
  }
}
export const parisCoord = {
  latitude: 48.864716,
  longitude: 2.349014,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
}
