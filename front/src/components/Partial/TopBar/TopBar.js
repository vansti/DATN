import React, { Component } from 'react';
import './TopBar.css';

class TopBar extends Component {
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
      <div className="top_bar">
        <div className="top_bar_container">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="top_bar_content d-flex flex-row align-items-center justify-content-start">
                  <ul className="top_bar_contact_list">
                    <li><div className="question">Have any questions?</div></li>
                    <li>
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <div>001-1234-88888</div>
                    </li>
                    <li>
                      <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      <div>info.deercreative@gmail.com</div>
                    </li>
                  </ul>
                  <div className="top_bar_login ml-auto">
                    <div className="login_button"><a href="#">Register or Login</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>				
      </div>
    );
  }
}

export default TopBar;