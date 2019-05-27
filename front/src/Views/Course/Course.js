import React, { Component } from 'react';
import './Course.css';

import ComponentSlider from './../../components/Slider'
import ComponentCourse from './../../components/Course'

class Course extends Component {
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
      <div>
        <ComponentSlider />
        <ComponentCourse />
      </div>
    );
  }
}

export default Course;