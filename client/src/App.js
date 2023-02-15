import React, {useState} from 'react'

import 'bootstrap/dist/css/bootstrap.css';

import {
  BrowserRouter as Router, 
  Switch,
  Route, 
  Redirect
} from "react-router-dom";
import { createBrowserHistory } from 'history';


import MainPage from './views/MainPage'
import AddPage from './views/AddPage'
import EditPage from './views/EditPage'
import DetailsPage from './views/DetailsPage'
import LogRegPage from './views/LogRegPage'
import NavigationBar from './components/NavigationBar'

import _ from 'lodash'

const App = () => {

  const history = createBrowserHistory();

  const [userLoggedIn, setUserLoggedIn] = useState({})
  console.log(_.isEmpty(userLoggedIn))

  // A wrapper for <Route> that redirects to the login
  // screen if you're not yet authenticated.
  const PrivateRoute = ({ children, ...rest }) => {
    
    return (
      <Route
        {...rest}
        render={({ location }) =>
          (!_.isEmpty(userLoggedIn)) ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  return (
    <div className="App">
      <Router history={history}>
        <NavigationBar
          userLoggedIn = {userLoggedIn}
          setUserLoggedIn = {setUserLoggedIn}
        />
        <Switch>
          
          <Route exact path="/login">
            <LogRegPage 
              userLoggedIn = {userLoggedIn}
              setUserLoggedIn = {setUserLoggedIn}
            />
          </Route>

          <PrivateRoute exact path="/">
            <MainPage
              userLoggedIn = {userLoggedIn}
            />
          </PrivateRoute>
          <PrivateRoute exact path="/pirates/new" >
            <AddPage/>
          </PrivateRoute>
          <PrivateRoute exact path="/pirates/:id" >
            <DetailsPage
              userLoggedIn = {userLoggedIn}
            />
          </PrivateRoute>
          <PrivateRoute exact path="/pirates/edit/:id" >
            <EditPage/>
          </PrivateRoute>
          
          <Redirect from ="*" to="/"/>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;

