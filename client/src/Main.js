import React, { Component } from "react";
import $ from 'jquery';
import {
  Route,
  NavLink,
  HashRouter,
  withRouter 
} from "react-router-dom";
import Home from "./Home";
import Browse from "./Browse";
import Signup from "./Signup";
import Login from "./Login";
import User from "./User";
import List from "./List";
import Watchlist from "./Watchlist";

import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faUserPlus, faSignInAlt, faHome, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { Label} from 'semantic-ui-react'

class Main extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      userID: localStorage.getItem( 'userID' ) || null,
      userName: localStorage.getItem( 'userName' ) || null,
      userEmail: localStorage.getItem( 'userEmail' ) || null,
      watchlistResults: 0
    };
    this.updateLogin = this.updateLogin.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onImport = this.onImport.bind(this);

    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.getMovies = this.getMovies.bind(this);
    this.getMovies();
  }

  addNotification(type) {
    switch(type)
    {
      case 'login':
        this.notificationDOMRef.current.addNotification({
          title: "Welcome back " + this.state.userName,
          message: "Hope you enjoy this website",
          type: "success",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 10000 },
          dismissable: { click: true }
        });
        break;
       case 'disconnect':
          this.notificationDOMRef.current.addNotification({
            title: "Logout successfull",
            message: "We hope to see you back soon",
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 5000 },
            dismissable: { click: true }
          });
          break;
        case 'import':
          this.notificationDOMRef.current.addNotification({
            title: "Your file was imported successfully",
            message: "The movies you've seen will appear in green",
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 10000 },
            dismissable: { click: true }
          });
          break;

          
    }
  }

  getMovies()
    {
        var userID = this.state.userID;
        var self = this;
        fetch('/api/watchlist')
        .then(res => res.json())
        .then(watchlistResults => this.setState({ watchlistResults: watchlistResults.length}));
    }

  onImport()
  {
    this.addNotification("import");
  }

  updateLogin(userArray)
  {
    var id = userArray.ID;
    var email = userArray.EMAIL;
    var name = userArray.NAME;
    localStorage.setItem( 'userID', id );
    localStorage.setItem( 'userEmail', email );
    localStorage.setItem( 'userName', name );
    this.setState({userID: id, userEmail: email, userName: name});
    this.addNotification("login");
  }

  disconnect()
  {
    localStorage.removeItem( 'userID');
    localStorage.removeItem( 'userEmail');
    localStorage.removeItem( 'userName');
    this.setState({userID: null});
    this.addNotification("disconnect");
  }
  render() {
    var firstLetter = "S";
    //var firstLetter = this.state.userName.substring(0,1);
    return (
      <HashRouter>
        <div>
          <div>
            <nav id="main-navbar" class="navbar navbar-expand-sm navbar-light bg-light static-top">
              <ul class="navbar-nav mr-auto">
              <Tooltip title="Home">
                <li class="nav-item">
                  <a class="navbar-brand"><NavLink to="/home"><FontAwesomeIcon icon={faHome}/></NavLink></a>
                </li>
              </Tooltip>
              <Tooltip title="Browse">
                <li class="nav-item">
                  <a class="navbar-brand"><NavLink to="/browse"><FontAwesomeIcon icon={faSearch}/></NavLink></a>
                </li>
              </Tooltip>
                {this.state.userID != null ?
                <Tooltip title="Watchlist">
                <li class="nav-item">
                    <a class="navbar-brand"><NavLink to="/watchlist">
                      <Badge badgeContent={this.state.watchlistResults} color="secondary">
                        <FontAwesomeIcon icon={faEye}/>
                      </Badge>
                      </NavLink></a>
                </li>
                </Tooltip>
                :<li></li>
                }
              </ul>
                <ul class="navbar-nav ml-auto">
                  {
                    this.state.userID == null ?
                    <div class="navbar-nav ml-auto">
                      <Tooltip title="Signup">
                        <li class="nav-item">
                            <a class="navbar-brand"><NavLink to="/signup"><FontAwesomeIcon icon={faUserPlus}/></NavLink></a>
                        </li>
                        </Tooltip>
                      <Tooltip title="Login">
                        <li class="nav-item">
                          <a class="navbar-brand"><NavLink to="/login"><FontAwesomeIcon icon={faSignInAlt}/></NavLink></a>
                        </li>
                      </Tooltip>
                      </div>
                    :
                    <div class="navbar-nav ml-auto">
                      <Tooltip title="User">
                        <li class="nav-item">
                          <a class="navbar-brand"><NavLink to="/user"><Label circular color={'red'}>{firstLetter}</Label></NavLink></a>
                        </li>
                        </Tooltip>
                      <Tooltip title="Logout">
                        <li class="nav-item">
                          <a class="navbar-brand" onClick={this.disconnect}><NavLink to="/browse" title="Logout"><FontAwesomeIcon icon={faSignOutAlt}/></NavLink></a>
                        </li>
                        </Tooltip>
                    </div>
                  }
                </ul>
            </nav>
          </div>
          <div className="content">
          <Route path="/home"  render={({history}) => (
              <Home 
              userID = {this.state.userID}
              history={history}
              />
            )}/>
            <Route path="/browse"  render={({history}) => (
              <Browse 
              userID = {this.state.userID}
              history={history}
              watchlistChange = {this.getMovies}
              />
            )}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/login"  render={({history}) => (
              <Login 
              onUpdate = {this.updateLogin}
              history={history}
              />
            )}/>
            <Route path="/user"  render={({history}) => (
              <User
              userID = {this.state.userID}
              userName = {this.state.userName}
              userEmail = {this.state.userEmail}
              history={history}
              onImport={this.onImport}
              />
              )}/>
              <Route path="/list"  render={({history}) => (
                <List 
                userID = {this.state.userID}
                history={history}
                watchlistChange = {this.getMovies}
                />
              )}/>
              <Route path="/watchlist"  render={({history}) => (
                <Watchlist 
                userID = {this.state.userID}
                history={history}
                watchlistChange = {this.getMovies}
                />
              )}/>
          </div>
          <ReactNotification ref={this.notificationDOMRef} />
      </div>
      </HashRouter>
    );
  }
}
export default Main;