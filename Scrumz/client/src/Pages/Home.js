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
					 console.log(this.state.boards);
				 })
				.catch(err =>{console.log(err)}
				);
	}

  onLogoutClick = e => {
	  e.preventDefault();
	  this.props.logoutUser();
  }



  FormRow() {
    return (
        <React.Fragment>
        <Grid item xs={4}>
          <Paper className="ok">
            <Button href = '/board' >
              <Card>
                Content of the card
              </Card>
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className="ok">
            <Button href = '/board' >
              <Card>
                Content of the card
              </Card>
            </Button>
          </Paper>
        </Grid>
      </React.Fragment>
    );
}

	render(){
		const {classes}=this.props;

		const {user} = this.props.auth;

		console.log(this.state.boards);


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
					<Button size="small" color="primary">
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
                    className="ok"
                >
                    Logout
              </Button>
			  <Grid container spacing = {3} justify="center" alignItems = "center">
			  	{boards}
	  		</Grid>
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
