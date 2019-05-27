import React, { Component } from 'react';
import './Header.css';
import TopBar from './../TopBar'
import NavBar from './../Navbar'
import Search from './../Search'
import NavBarSP from './../NavBarSP'
class Header extends Component {
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
      <header className="header">
        <TopBar></TopBar>
        <NavBar></NavBar>
        <Search></Search>
        <NavBarSP></NavBarSP>
      </header>
    );
  }
}

export default Header;