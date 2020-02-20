import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Provider} from "react-redux";
import store from "./store"

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import {setCurrentUser, logoutUser} from "./actions/authActions";

import Header from './Components/Header';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Board from './Pages/Board';
import Profile from './Pages/Profile';
import NewBoard from './Pages/NewBoard';
import PrivateRoute from "./Pages/private-route/PrivateRoute";

//Check for token to keep user logged in
if (localStorage.jwtToken){
	//Set auth token header auth
	const token = localStorage.jwtToken;
	setAuthToken(token);
	//Decode token and get user info and exp
	const decoded = jwt_decode(token);
	//Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	//Check for expired token
	const currentTime = Date.now() / 1000; //to get in milliseconds
	if(decoded.exp < currentTime) {
		//Logout user
		store.dispatch(logoutUser());

		//Redirect to login
		window.location.href = "./login";
	}
}

class App extends Component {
	//Initialize state
	state = {
		data: [],
		id: 0,
		username: null,
		email: null,
		password: null,
		profile_picture_url: null,
		intervalIsSet: false,
		idToDelete: null,
		idToUpdate: null,
		objectToUpdate: null
	};


	// when component mounts, first thing it does is fetch all existing data in our db
  	// then we incorporate a polling logic so that we can easily see if our db has
  	// changed and implement those changes into our UI
	// componentDidMount() {
	// 	this.getDataFromDb();
	// 	if (!this.state.intervalIsSet) {
	// 		let interval = setInterval(this.getDataFromDb, 1000);
	// 		this.setState({intervalIsSet: interval});
	// 	}
	// }

	// never let a process live forever
  	// always kill a process everytime we are done using it
	// componentWillUnmount(){
	// 	if(this.state.intervalIsSet) {
	// 		clearInterval(this.state.intervalIsSet);
	// 		this.setState({intervalIsSet: null});
	// 	}
	// }

	// just a note, here, in the front end, we use the id key of our data object
  	// in order to identify which we want to Update or delete.
  	// for our back end, we use the object id assigned by MongoDB to modify
  	// data base entries

  	// our first get method that uses our backend api to
  	// fetch data from our data base
	// getDataFromDb = () => {
	// 	fetch('http://localhost:3001/api/getData')
	// 	.then((data) => data.json())
	// 	.then((res) => this.setState({data: res.data}));
	// };

	// our put method that uses our backend api
	// to create new query into our data base
	// putDataToDB = (username) => {
	// 	let currentIds = this.state.data.map((data) => data.id);
	// 	let idToBeAdded = 0;
	// 	while(currentIds.includes(idToBeAdded)){
	// 		++idToBeAdded;
	// 	}
	//
	// 	axios.post('http://localhost:3001/api/putData', {
	// 		id: idToBeAdded,
	// 		username: username,
	// 	});
	// };

	// our delete method that uses our backend api
  	// to remove existing database information
	// deleteFromDb = (idTodelete) => {
	// 	parseInt(idTodelete);
	// 	let objIdToDelete = null;
	// 	this.state.data.forEach((dat) => {
	// 		if(dat.id == idTodelete) {
	// 			objIdToDelete = dat._id;
	// 		}
	// 	});
	//
	// 	axios.delete('http://localhost:3001/api/deleteData', {
	// 		data: {
	// 			id: objIdToDelete
	// 		}
	// 	});
	// };

	// our update method that uses our backend api
  	// to overwrite existing data base information
	// updateDB = (idToUpdate, updateToApply) => {
	// 	let objIdToUpdate= null;
	// 	parseInt(idToUpdate);
	// 	this.state.data.forEach((dat) => {
	// 		if (dat.id == idToUpdate) {
	// 			objIdToUpdate = dat._id;
	// 		}
	// 	});
	//
	// 	axios.post('http://localhost:3001/api/updateData', {
	// 		id: objIdToUpdate,
	// 		update: {username: updateToApply},
	// 	});
	// };


	render()  {
	  return (
		  <Provider store={store}>
		    <Router>
		      <div className="App">
		        <Header/>
		          <Route path = "/login" component = {Login}/>
		          <Route path = "/register" component = {Register}/>
		          <Route path = "/board" component = {Board}/>
				  <Route path = "/profile" component = {Profile}/>
				  <Switch>
				  	<PrivateRoute path="/home" component={Home}/>
					<PrivateRoute path="/newboard" component={NewBoard}/>
				  </Switch>
		      </div>
		    </Router>
		</Provider>
	  );
  }

}

export default App;
