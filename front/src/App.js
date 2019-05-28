import React from 'react';
import { Switch, Route , withRouter, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
//css Page
import './assets/styles/main_styles.css';
import './assets/styles/responsive.css';

import './App.css';

// Containers
import DefaultLayout from './containers/DefaultLayout'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} />} />
);

function App() {
  return (
    <div>
      <PrivateRoute path="/" component={DefaultLayout} />
    </div>
  );
}

export default App;
