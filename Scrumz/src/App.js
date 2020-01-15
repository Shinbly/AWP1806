import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 

import Header from './Components/Header';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Board from './Pages/Board';

function App()  {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route path = "/login" component = {Login}/>
          <Route path = "/register" component = {Register}/>
          <Route path = "/home" component = {Home}/>
          <Route path = "/board" component = {Board}/>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
