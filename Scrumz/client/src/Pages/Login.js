import React, {Component} from "react";
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
import {loginUser} from "../actions/authActions";
import classnames from "classnames";

 class Login extends Component {

	constructor(){
		super();
		this.state = {
			email: "",
			password: "",
			errors: {}
		};
	}

	componentDidMount(){
		//If logged in and user navigates to Login pages, should redirect them to home
		if(this.props.auth.isAuthenticated){
			this.props.history.push("/home");
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.auth.isAuthenticated) {
			this.props.history.push("/home"); //push user to home when they login
		}

		if(nextProps.errors){
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	onSubmit = e => {

		e.preventDefault();

		const userData = {
			email: this.state.email,
			password: this.state.password
		};

		this.props.loginUser(userData); //since we handle the redirect within our component
		//we don't need to pass in this.props.history as a parameter
	};

	render() {
		const{errors} = this.state;

		return (

			// const useStyles = makeStyles(theme => ({
			//   paper: {
			//     marginTop: theme.spacing(8),
			//     display: 'flex',
			//     flexDirection: 'column',
			//     alignItems: 'center',
			//   },
			//   avatar: {
			//     margin: theme.spacing(1),
			//     backgroundColor: theme.palette.secondary.main,
			//   },
			//   form: {
			//     width: '100%', // Fix IE 11 issue.
			//     marginTop: theme.spacing(1),
			//   },
			//   submit: {
			//     margin: theme.spacing(3, 0, 2),
			//   },
			// }));


			//const classes = useStyles();



		<Container component="main" maxWidth="xs">
		  <CssBaseline />
		  <div className="ok">
			<Avatar className="ok">
			  <LockOutlinedIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
			  Sign in
			</Typography>
			<form noValidate onSubmit={this.onSubmit}>
				<div>
					<TextField
						onChange = {this.onChange}
						value = {this.state.email}
						error = {errors.email}
						className={classnames("", {
							invalid: errors.email || errors.emailnotfound
						})}
						type="email"
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
					<span className="red-text">{errors.email}{errors.emailnotfound}</span>
				</div>

			  <TextField
			  	onChange = {this.onChange}
				value = {this.state.password}
				error = {errors.password}
				className={classnames("", {
					invalid: errors.password || errors.passwordincorrect
				})}
				variant="outlined"
				margin="normal"
				required
				fullWidth
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="current-password"
			  />
			  <span className="red-text">{errors.password}{errors.passwordincorrect}</span>
			  <FormControlLabel
				control={<Checkbox value="remember" color="primary" />}
				label="Remember me"
			  />
			  <Button
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
			  >
				Sign In
			  </Button>
			</form>
		  </div>
		</Container>
	  );
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{loginUser}
)(Login);
