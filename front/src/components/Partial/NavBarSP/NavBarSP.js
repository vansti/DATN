import React, { Component } from 'react';
import './NavBarSP.css';

class NavBarSP extends Component {
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
      <div className="menu d-flex flex-column align-items-end justify-content-start text-right menu_mm trans_400">
        <div className="menu_close_container"><div className="menu_close"><div></div><div></div></div></div>
        <div className="search">
          <form action="#" className="header_search_form menu_mm">
            <input type="search" className="search_input menu_mm" placeholder="Search" required="required"></input>
            <button className="header_search_button d-flex flex-column align-items-center justify-content-center menu_mm">
              <i className="fa fa-search menu_mm" aria-hidden="true"></i>
            </button>
          </form>
        </div>
        <nav className="menu_nav">
          <ul className="menu_mm">
            <li className="menu_mm"><a href="index.html">Home</a></li>
            <li className="menu_mm"><a href="#">About</a></li>
            <li className="menu_mm"><a href="#">Courses</a></li>
            <li className="menu_mm"><a href="#">Blog</a></li>
            <li className="menu_mm"><a href="#">Page</a></li>
            <li className="menu_mm"><a href="contact.html">Contact</a></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default NavBarSP;