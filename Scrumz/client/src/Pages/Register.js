import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser} from "../actions/authActions";
import classnames from "classnames";


class Register extends Component {

	constructor() {
		super();
		this.state = {
			username: "",
			email: "",
			password: "",
			password2: "",
			errors: {}
		};
	}

	componentDidMount(){
		//If logged in and user navigates to Register pages, should redirect them to home
		if(this.props.auth.isAuthenticated){
			this.props.history.push("/home");
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors){
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onChanged = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	onSubmit = e => {
		e.preventDefault();

		const newUser = {
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};

		this.props.registerUser(newUser, this.props.history);
	};

	render() {

		// const useStyles = makeStyles(theme => ({
		//   paper: {
		// 	marginTop: theme.spacing(8),
		// 	display: 'flex',
		// 	flexDirection: 'column',
		// 	alignItems: 'center',
		//   },
		//   avatar: {
		// 	margin: theme.spacing(1),
		// 	backgroundColor: theme.palette.secondary.main,
		//   },
		//   form: {
		// 	width: '100%', // Fix IE 11 issue.
		// 	marginTop: theme.spacing(1),
		//   },
		//   submit: {
		// 	margin: theme.spacing(3, 0, 2),
		//   },
		// }));



	  //const classes = useStyles();

	  const {errors} = this.state;

	  return (
	    <Container component="main" maxWidth="xs">
	      <CssBaseline />
	      <div className="ok">
	        <Avatar className="ok">
	          <LockOutlinedIcon />
	        </Avatar>
	        <Typography component="h1" variant="h5">
	          Sign Up
	        </Typography>
	        <form noValidate onSubmit={this.onSubmit} className="ok">
	          <TextField
			  	onChange={this.onChange}
				value = {this.state.username}
				error={errors.username}
				className = {classnames("", {
					invalid: errors.username
				})}
	          	variant = "outlined"
	          	margin = "normal"
	          	required
	          	fullWidth
	          	id = "username"
	          	label = "UserName"
	          	name = "username"
	          	autoComplete = "username"
	          	autoFocus
	            /
	            >
				<span className = "red-text">{errors.username}</span>
	          <TextField
			  	onChange = {this.onChange}
				value = {this.state.email}
				error = {errors.email}
				className = {classnames("", {
					invalid: errors.email
				})}
				type = "email"
	            variant="outlined"
	            margin="normal"
	            required
	            fullWidth
	            id="email"
	            label="Email Address"
	            name="email"
	            autoComplete="email"
	            autoFocus
	          />
			  <span className = "red-text">{errors.email}</span>
	          <TextField
			  	onChange = {this.onChange}
				value = {this.state.password}
				error = {errors.password}
				className = {classnames("", {
					invalid: errors.password
				})}
			  	variant="outlined"
	            margin="normal"
	            required
	            fullWidth
	            name="password"
	            label="Password"
	            type="password"
	            id="password"
	            //autoComplete="current-password"
	          />
			  <span className = "red-text">{errors.password}</span>
			  <TextField
			  	onChange = {this.onChange}
				value = {this.state.password2}
				error = {errors.password2}
				className = {classnames("", {
					invalid: errors.password2
				})}
			  	variant="outlined"
	            margin="normal"
	            required
	            fullWidth
	            name="password2"
	            label="Confirm Password"
	            type="password"
	            id="password2"
	            //autoComplete="current-password"
	          />
			  <span className = "red-text">{errors.password2}</span>
	          <Button
	            href = '/home'
	            type="submit"
	            fullWidth
	            variant="contained"
	            color="primary"
	            className="ok"
	          >
	            Sign Up
	          </Button>
	        </form>
	      </div>
	    </Container>
	  );
  }
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{registerUser}
)(withRouter(Register));
