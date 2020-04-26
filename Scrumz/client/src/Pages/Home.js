import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, CardActionArea, CardContent, CardMedia, CardActions, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
//import axios from "axios";
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';

import Texture from "../Assets/boardsImg/texture1.jpg";

import { ProjectServices } from '../Models/ProjectServices';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	cards: {
		maxWidth: 345
	},
	title: {
		marginRight: 'auto',
		marginLeft: 'auto'
	},
});

class Home extends Component {

	constructor() {
		super();
		this.state = {
			projects: [],
			errors: {},
			deleteProjectDialogOpen : false,
			projectIdToDelete : '',
			newProjectDialogOpen: false,
			newProjectName: "",
		};
	}

	componentDidMount() {
		ProjectServices.getProjectsByUser(this.props.auth.user.id)
			.then(res => {
				var projects = [];
				res.data.forEach((project, i) => {
					if(!projects.map(value=>value._id.toString()).includes(project._id.toString())){
						projects.push(project);
					}
				});

				this.setState({ projects: projects });
			})
			.catch(err => { console.log(err) }
			);
	}

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	}

	onNewProject(newProject) {
		ProjectServices.newProject(newProject).then(res => {
			var projects = this.state.projects;
			projects.push(res.data);
			this.setState({ projects: projects });
			//this.props.history.push(`/project/${res.data._id}`);
		})
	}

	onDeleteProject(projectId){
		ProjectServices.deleteProject(projectId).then(res => {
				var projects = this.state.projects;
				projects.filter((value, index) => { return value._id != projectId });
				this.setState({projects : projects});
		});
	}

	handleClickOpen = () => {
		this.setState({ newProjectDialogOpen: true });
	};

	handleClose = () => {
		this.setState({ newProjectDialogOpen: false });
	};

	onChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	onSubmit = e => {
		e.preventDefault();

		var id = this.props.auth.user.id;
		var newProject = {
			name: this.state.newProjectName,
			boards: [],
			manager: id,
		};
		this.onNewProject(newProject);
	};



	render() {
		const { classes } = this.props;

		const projects = this.state.projects.map(project => (
			<Grid id ={project._id} item key={project._id}>
				<Card className={classes.cards} >
					<CardActionArea>
						<CardMedia
							onClick={() => this.props.history.push(`/project/${project._id}`)}
							component="img"
							alt="Texture"
							height="140"
							image={Texture}
						/>
						<CardContent>
							<Typography>{project.name}</Typography>
						</CardContent>
					</CardActionArea>
					<CardActions>
						<Button color="primary"	onClick={() => this.props.history.push(`/project/${project._id}`)}>
								See project
						</Button>
						{this.props.auth.user.id === project.manager ?
							<Button onClick={()=>{this.setState({projectIdToDelete : project._id, deleteProjectDialogOpen: true})}} color="primary">
								Delete project
							</Button>
							: null}
					</CardActions>
				</Card>
			</Grid>
		));

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<div style={{width: 200}} ></div>
						<Button onClick={() => {}} className={classes.title} color="inherit">
							<Typography variant="h6" className={classes.title}>
								Scrumz
			  				</Typography>
						</Button>
						<div style={{width: 200}} >
							<Button onClick={this.onLogoutClick} color="inherit">
								Logout
							</Button>
							<Button onClick={() => {this.props.history.push("/profile")}} color="inherit">
								Profile
							</Button>
						</div>
					</Toolbar>
				</AppBar>
				<h1>Your Projects</h1>
				<Grid container spacing={3} justify="center" alignItems="center">
					{projects}
				</Grid>
				<Button onClick={this.handleClickOpen} variant="contained" color="primary">
					new Project
        </Button>
				<Dialog open={this.state.newProjectDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Create a new Project</DialogTitle>
					<form noValidate onSubmit={this.onSubmit}>
						<DialogContent>
							<DialogContentText>
								To create a new project, please enter the Name of the project here.
							</DialogContentText>
							<TextField
								onChange={this.onChange}
								value={this.state.newProjectName}
								id='newProjectName'
								variant="outlined"
								margin="normal"
								required
								fullWidth
								label="Name"
								name="name"
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleClose} color="primary">
								Cancel
							</Button>
							<Button type="submit" onClick={this.handleClose} color="primary">
								Create
							</Button>
						</DialogActions>
					</form>
				</Dialog>


				<Dialog open={this.state.deleteProjectDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle>Delete the Project ? </DialogTitle>
						<DialogContent>
							<DialogContentText>
								Do you realy want to delete the project ?.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={()=>{this.setState({deleteProjectDialogOpen: false})}} color="primary">
								Cancel
							</Button>
							<Button type="submit" onClick={
									()=>{
										this.onDeleteProject(this.state.projectIdToDelete);
										this.setState({deleteProjectDialogOpen: false})
									}
								} color="secondary">
								Delete
							</Button>
						</DialogActions>
				</Dialog>
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
	{ logoutUser }
)(Home));
