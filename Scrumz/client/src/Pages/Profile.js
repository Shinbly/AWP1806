import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { withStyles } from '@material-ui/styles';
import axios from "axios";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import avatarDefault from "../Assets/UserProfile.png";

import { UserServices } from '../Models/UserServices';


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


class Profile extends Component {
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

	componentDidMount() {
		UserServices.getuser(this.props.auth.user.id)
			.then(res => {
				this.setState({
					username: res.data.username,
					email: res.data.email,
				})
			})
			.catch(err => { console.log(err) });
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	onSubmit = e => {
		e.preventDefault();

		const updateUser = {
			id: this.props.auth.user.id,
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};
		UserServices.updateUser(updateUser)
			.then(res => console.log("ok"))
			.catch(err => console.log("err", err));
	};

	render() {
		const { errors } = this.state;

		const { classes } = this.props;

		return (
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
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div className="ok">
						<Typography component="h1" variant="h5">
							Update personal informations
				</Typography>
						<form noValidate onSubmit={this.onSubmit}>
							<Tooltip title={this.state.username}>
								<Avatar alt={this.state.username} src={this.state.avatar} />
							</Tooltip>

							<TextField
								onChange={this.onChange}
								value={this.state.username}
								error={errors.username}
								className={classnames("", {
									invalid: errors.username
								})}
								variant="outlined"
								margin="normal"
								fullWidth
								id="username"
								label="Username"
								name="username"
								autoComplete="username"
							/>
							<span className="red-text">{errors.username}</span>
							<TextField
								onChange={this.onChange}
								value={this.state.email}
								error={errors.email}
								className={classnames("", {
									invalid: errors.email
								})}
								type="email"
								variant="outlined"
								margin="normal"
								fullWidth
								id="email"
								label="email address"
								name="email"
								autoComplete="email"
							/>
							<span className="red-text">{errors.email}</span>
							<TextField
								onChange={this.onChange}
								value={this.state.password}
								error={errors.password}
								className={classnames("", {
									invalid: errors.password
								})}
								variant="outlined"
								margin="normal"
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
							//autoComplete="current-password"
							/>
							<span className="red-text">{errors.password}</span>
							<TextField
								onChange={this.onChange}
								value={this.state.password2}
								error={errors.password2}
								className={classnames("", {
									invalid: errors.password2
								})}
								variant="outlined"
								margin="normal"
								fullWidth
								name="password2"
								label="Confirm Password"
								type="password"
								id="password2"
							//autoComplete="current-password"
							/>
							<span className="red-text">{errors.password2}</span>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className="ok"
							>
								Update
				  </Button>
						</form>
					</div>
				</Container>
			</div>
		);
	}
}

Profile.propTypes = {
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
)(withRouter(Profile)));
