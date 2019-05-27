import React, { Component } from 'react';
import './DefaultLayout.css';

//router
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from '../../routes';

import DefaultHeader from '../../components/Partial/Header';
import DefaultFooter from '../../components/Partial/Footer';

class DefaultLayout extends Component {
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
      <div className="app">
        <DefaultHeader />
        <Switch>
          {routes.map((route, idx) => {
            return route.component ? (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={props => (
                  <route.component {...props} />
                )} />
              ) : (null);
          })}
          <Redirect from="/" to="/home" />
        </Switch>
        <DefaultFooter />
      </div>
    );
  }
}

export default DefaultLayout;