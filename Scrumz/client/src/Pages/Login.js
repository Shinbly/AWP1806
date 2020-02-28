import React, {Component} from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser} from "../actions/authActions";
import classnames from "classnames";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/styles';


const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
	},
});

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

        const { classes } = this.props;

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
<div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Scrumz
              </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="xs" className="formulaire">
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
            </Container>
		  </div>
	  );
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
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
	{loginUser}
)(Login));
