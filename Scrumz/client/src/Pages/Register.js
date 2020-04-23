import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser} from "../actions/authActions";
import classnames from "classnames";
import {withStyles} from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';


	const styles = theme => ({
	  avatar: {
	  },
	  form: {
		width: '100%', // Fix IE 11 issue.
	  },
	  submit: {
	  },
	  root: {
  		flexGrow: 1,
  	},
  	title: {
  		flexGrow: 1,
  	},
	});




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

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
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
	  const {errors} = this.state;

	  const { classes } = this.props;

	  return (
		  <div className={classes.root}>
  			<AppBar position="static">
  				<Toolbar>
						<div style ={{width : 100}} >
						</div>
  					<Typography variant="h6" className={classes.title}>
  						Scrumz
            </Typography>
  					<Button  style ={{width : 100}} href='/login' color="inherit">
  						Login
            </Button>
  				</Toolbar>
  			</AppBar>
	    <Container component="main" maxWidth="xs">
	      <CssBaseline />
	      <div className="ok">
	        <Avatar className="ok" style ={{marginTop : 10,marginBottom : 10, flexGrow: 1, marginRight: 'auto', marginLeft: 'auto'}}>
	          <LockOutlinedIcon />
	        </Avatar>
	        <Typography component="h1" variant="h5">
	          Sign Up
	        </Typography>
	        <form noValidate onSubmit={this.onSubmit}>
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
	            />
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
	            type="submit"
	            fullWidth
	            variant="contained"
	            color="primary"
	            className="ok"
	          >
	            Sign Up
	          </Button>
	        </form>
			<Link href="/login">Already have an account ? Sign in !</Link>
	      </div>
	    </Container>

	</div>
	  );
  }
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default withStyles(styles)(connect(
	mapStateToProps,
	{registerUser}
)(withRouter(Register)));
