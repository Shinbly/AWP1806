import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Card, CardActionArea, CardContent, CardMedia, CardActions, Typography} from '@material-ui/core';
import {Button } from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";
import axios from "axios";
import {withStyles} from '@material-ui/styles';

import Texture from "../Assets/boardsImg/texture1.jpg";


const styles = theme => ({
   root: {
     flexGrow: 1,
   },
   cards: {
	   maxWidth: 345
   }
});

class Home extends Component {

	constructor(){
		super();
		this.state = {
			boards: [],
			errors: {}
		};
	}

	componentDidMount(){
		let user = {id: this.props.auth.user.id};
			axios
				.post("/api/boards/getboards", user)
				.then(res => {
					this.setState({boards: res.data});
				 })
				.catch(err =>{console.log(err)}
				);
	}

  onLogoutClick = e => {
	  e.preventDefault();
	  this.props.logoutUser();
  }

	createNewBoard = e => {
	  var id = this.props.auth.user.id;
	  var newBoard = {
		  name: `test Board`,
		  columns: [],
		  members: [id],
		  manager: id,
	  };
	  this.onNewBoard(newBoard);
  }

	onNewBoard(newBoard){
		axios.post("/api/boards/newboard", newBoard).then(res => {
			var boards = this.state.boards;
			boards.push(res.data);
			this.setState({ boards: boards });
		})
  }

	render(){
		const {classes}=this.props;

		const {user} = this.props.auth;


		const boards = this.state.boards.map(board => (
			<Grid item key={board._id}>
			<Card className={classes.cards} >
				<CardActionArea>
					<CardMedia
						component="img"
						alt="Texture"
						height="140"
						image={Texture}
					/>
				<CardContent>
					<Typography>{board.name}</Typography>
				</CardContent>
				</CardActionArea>
				<CardActions>
					<Button size="small" color="primary"
						onClick={() => this.props.history.push(
							{
								pathname: "/board",
								data:
								{
									id: board._id,
									columns: board.columns,
								}
							})
					}>
						See Board
					</Button>
				</CardActions>
			</Card>
			</Grid>
		));

		return (
		  <div className="ok">
			 <h1>Your Board</h1>
			 <Button
                    onClick={this.onLogoutClick}
                    variant="contained"
                    color="primary"
                >
                    Logout
              </Button>
			  <Grid container spacing = {3} justify="center" alignItems = "center">
			  	{boards}
			  </Grid>
			  <Button
				onClick = {() => this.props.history.push("/newboard")}
                variant="contained"
                color="primary"
              >
              	new Board
              </Button>
		  </div>
		);
	}
}

Home.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default withStyles(styles)(connect(
    mapStateToProps,
    {logoutUser}
)(Home));
