import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';

import './Navbar.css';

class Navbar extends Component {
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
      <div className="header_container">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="header_content d-flex flex-row align-items-center justify-content-start">
                <div className="logo_container">
                  <Link to="/">
                    <div className="logo_text">Unic<span>at</span></div>
                  </Link>
                </div>
                <nav className="main_nav_contaner ml-auto">
                  <ul className="main_nav">
                    <li className="active"><a href="/">Home</a></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/course">Courses</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="#">Page</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                  <div className="search_button"><i className="fa fa-search" aria-hidden="true"></i></div>

                  <div className="shopping_cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></div>
                  <div className="hamburger menu_mm">
                    <i className="fa fa-bars menu_mm" aria-hidden="true"></i>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>	
      </div>
    );
  }
}

export default Navbar;