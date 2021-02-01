import React, { Component } from "react";
import { threshold } from "react-native-color-matrix-image-filters";
import {Polyline} from 'react-native-maps';


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  

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

  clean(){
    const self = this;
    this.setState({coords:[]})

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinates !== this.props.coordinates) {
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