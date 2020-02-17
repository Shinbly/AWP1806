import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


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

		console.log(newUser);
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
	          <TextField
			  	onChange = {this.onChange}
				value = {this.state.email}
				error = {errors.email}
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
	          <TextField
			  	onChange = {this.onChange}
				value = {this.state.password}
				error = {errors.password}
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
			  <TextField
			  	onChange = {this.onChange}
				value = {this.state.password2}
				error = {errors.password2}
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
	          <Grid container>
	            <Grid item>
	              <Link href="/login" variant="body2">
	                {"Already an account? Sign In"}
	              </Link>
	            </Grid>
	          </Grid>
	        </form>
	      </div>
	    </Container>
	  );
  }
}

export default Register;
