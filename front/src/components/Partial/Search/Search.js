import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
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
      <div className="header_search_container">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="header_search_content d-flex flex-row align-items-center justify-content-end">
                <form action="#" className="header_search_form">
                  <input type="search" className="search_input" placeholder="Search" required="required"></input>
                  <button className="header_search_button d-flex flex-column align-items-center justify-content-center">
                  <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>			
      </div>
    );
  }
}

export default Search;