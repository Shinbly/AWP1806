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
//import axios from "axios";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
//import avatarDefault from "../Assets/UserProfile.png";

import { UserServices } from '../Models/UserServices';


const styles = theme => ({
	avatar: {
		width: 70,
		height: 70
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
			avatar: "",
			errors: {}
		};
	}

	componentDidMount() {
		UserServices.getuser(this.props.auth.user.id)
			.then(res => {
				this.setState({
					username: res.data.username,
					email: res.data.email,
					avatar: res.data.avatar,
				})
			})
			.catch(err => { console.log(err) });
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	onPictureChange = e =>{
		var target = e.target;
		var selectedfile = document.getElementById(target.id).files;

		if (selectedfile.length > 0) {
			var imageFile = selectedfile[0];
			var fileReader = new FileReader();
			var newImage = document.createElement('img');
			newImage.id = "imgAvatar";
			//var dataurl;

			fileReader.onload = function (fileLoadedEvent) {
				var srcData = fileLoadedEvent.target.result;
				newImage.src = srcData;

				const MAX_SIDE = 75;

				newImage.width = MAX_SIDE;
				newImage.height = MAX_SIDE;

				document.getElementById("avatar").innerHTML = newImage.outerHTML;
			}
			fileReader.readAsDataURL(imageFile);
		}
	}

	onSubmit = e => {
		e.preventDefault();

		var imageDataURL = this.state.avatar;

		if(document.getElementById("imgAvatar") !== null){
			var avatarUrl = document.getElementById("imgAvatar").src;
			var newImage = document.createElement('img');
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			newImage.src = avatarUrl;
			ctx.drawImage(newImage,0,0);

			console.log('image is of size : '+newImage.width + " "+newImage.height);

			var MAX_SIDE = 75;
			var width = newImage.width;
			var height = newImage.height;
			if (width > height) {
			   if (height > MAX_SIDE) {
				width *= MAX_SIDE / height;
				height = MAX_SIDE;
			  }
			} else {
				if (width > MAX_SIDE) {
				height *= MAX_SIDE / width;
				width = MAX_SIDE;
			  }
		  }

			canvas.width = width;
			canvas.height = height;
			console.log('canvas is of size : '+ canvas.width + " " + canvas.height);

			ctx.drawImage(newImage,0,0,newImage.width,newImage.height,0,0,width,height);

			imageDataURL = canvas.toDataURL();
		}

		const updateUser = {
			id: this.props.auth.user.id,
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
			avatar: imageDataURL,
		};
		UserServices.updateUser(updateUser)
			.then(res => {console.log("ok"); this.props.history.push("/home")})
			.catch(err => console.log("err", err));
	};

	render() {
		const { errors } = this.state;

		const { classes } = this.props;

		return (
			<div className={classes.root}>

				<AppBar position="static">
					<Toolbar>
						<Button onClick={() => {this.props.history.push("/home")}} className={classes.title} color="inherit">
							<Typography variant="h6" className={classes.title}>
								Scrumz
			  				</Typography>
						</Button>
					</Toolbar>
				</AppBar>

				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div className="ok">
						<Typography component="h1" variant="h5">
							Update personal informations
				</Typography>
						<form noValidate onSubmit={this.onSubmit}>
							<input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={this.onPictureChange}/>
							<label htmlFor="icon-button-file">
								<IconButton color="primary" aria-label="upload picture" component="span">
									<Tooltip title={this.state.username}>
										<Avatar id="avatar" alt={this.state.username} src={this.state.avatar} className={classes.avatar}/>
									</Tooltip>
								</IconButton>
							</label>


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
