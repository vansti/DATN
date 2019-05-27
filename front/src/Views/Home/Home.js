import React, { Component } from 'react';
import './Home.css';

import Slider from './../../components/Slider'
import Feature from './../../components/Feature'
import Course from './../../components/Course'
import Counter from './../../components/Counter'
import Event from './../../components/Event'
import Team from './../../components/Team'
import New from './../../components/New'

class Home extends Component {
  // constructor(props){
    // super(props);
    // this.state = {};
  // }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <main>
        <Slider></Slider>
        <Feature></Feature>
        <Course></Course>
        <Counter></Counter>
        <Event></Event>
        <Team></Team>
        <New></New>
      </main>
    );
  }
}

export default Home;