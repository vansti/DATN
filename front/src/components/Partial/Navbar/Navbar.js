import React, { Component } from 'react';
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
                  <a href="#">
                    <div className="logo_text">Unic<span>at</span></div>
                  </a>
                </div>
                <nav className="main_nav_contaner ml-auto">
                  <ul className="main_nav">
                    <li className="active"><a href="#">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="courses.html">Courses</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="#">Page</a></li>
                    <li><a href="contact.html">Contact</a></li>
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