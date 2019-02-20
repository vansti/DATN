import React, { Component } from 'react';
import Loadable from 'react-loadable';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import store from './store/store';
import { setCurrentStudent, logoutStudent } from './actions/authActions';
import './App.scss';
import { TransitionGroup } from 'react-transition-group';
import { Switch, Route , withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Auth from './store/auth';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentStudent(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutStudent());
    // Redirect to login
    window.location.href = '/login';
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
);

class App extends Component {

  render() {
    const { location, auth } = this.props;

    return (
      <div>
        { auth.isAuthenticated === true
          ? <PrivateRoute path="/" component={DefaultLayout} />
          : <div className="main">
              <TransitionGroup>
                <Switch location={location}>
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route exact path="/" component={Login}  />
                </Switch>
              </TransitionGroup>
            </div>
        }
        </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(App));
