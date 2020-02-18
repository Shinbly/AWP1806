import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Card, CardActionArea, Button } from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";

class Home extends Component {

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
			<Grid container spacing={1}>
			  <Grid container item xs={12} spacing={3}>
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
			  </Grid>
			  <Grid container item xs={12} spacing={3}>
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
			  </Grid>
			</Grid>
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
