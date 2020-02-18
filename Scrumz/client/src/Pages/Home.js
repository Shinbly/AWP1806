import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Card, CardActionArea, Button } from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";
import axios from "axios";

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

	  // const useStyles = makeStyles(theme => ({
	  //   root: {
	  //     flexGrow: 1,
	  //   },
	  //   paper: {
	  //     padding: theme.spacing(1),
	  //     textAlign: 'center',
	  //     color: theme.palette.text.secondary,
	  //   },
	  // }));
	  // const classes = useStyles();
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
		const {user} = this.props.auth;

		console.log(this.state.boards);

		const boards = this.state.boards.map(board => (
			<Paper elevation={3}>
				<p>name: {board.name}</p>
			</Paper>
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
			  {boards}
		  </div>
		);
	}
}

Home.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{logoutUser}
)(Home);
