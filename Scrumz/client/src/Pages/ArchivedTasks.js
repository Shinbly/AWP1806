import React, { Component } from 'react';
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
import {GridList, Button} from '@material-ui/core';

import Task from '../Components/Task'

import { UserServices } from '../Models/UserServices';
import { BoardServices } from '../Models/BoardServices';
import { TaskServices } from '../Models/TaskServices';


const styles = theme => ({
	task: {
		padding : 0,
		backgroundColor: "lighblue",
		width: "90%",
		margin: "auto",
		marginBottom: 10,
	},
	title: {
		flexGrow: 1,
		marginRight: 'auto',
		marginLeft: 'auto'
	},
});


class ArchivedTasks extends Component {
	constructor() {
		super();
		this.state = {
			boardId: "",
			userId: "",
			archived_tasks: [],
			members : [],
		};
	}

	componentDidMount() {
		try{
			var userId = this.props.location.data.user_id;
			var boardId = this.props.location.data.id;
			var members = this.props.location.data.members;


			BoardServices.getboardbyid(boardId).then(async boardData => {
				var board = boardData.data;
				var archived_tasks_ids = board.archived_tasks;

				await TaskServices.getTasks({ids: archived_tasks_ids}).then((tasks) => {
					var archivedTasks = [];
					archivedTasks = tasks.data;

					tasks.data.sort((a,b)=>{
						var indexA = archived_tasks_ids.findIndex((id)=>{
							return a._id === id;
						});
						var indexB = archived_tasks_ids.findIndex((id)=>{
							return b._id === id;
						});
						return indexA - indexB;
					});

					this.setState({
						boardId: boardId,
						userId: userId,
						archived_tasks: archivedTasks,
						members : members,
					});
				});
			});
		}catch(e){
			console.log(e);
			this.props.history.push("/home");
		}
	}

	backToBoard(){

	}

	render() {
		const { errors } = this.state;

		const { classes } = this.props;

		return (
			<div className={classes.root}>

				<AppBar position="static">
					<Toolbar>
					<Button color="white"
						onClick={() => this.props.history.push(
							{
								pathname: "/board",
								data:
								{
									id: this.state.boardId,
									user_id : this.state.userId,
								}
							})
						}>
							See Board
					</Button>
						<Button onClick={() => {this.props.history.push("/home")}} className={classes.title}>
							<Typography variant="h6" className={classes.title}>
								Scrumz
			  				</Typography>
						</Button>
					</Toolbar>
				</AppBar>

				<Container component="main" maxWidth="xs">
					<GridList className={classes.gridList} cols={5}>
						{
							this.state.archived_tasks.map((task, index) => (
								<Task
									id={task._id}
									user={this.state.userId}
									boardId={this.state.boardId}
									index={index}
									className={classes.task}
									task={task}
									onClickEdit={null}
									draggable="false"
									onDragEnd={() => {}}
									columnid={""}
									color={task.color}
									assignTeamMembers={task.assignTeamMembers.map((member) => {
										var myMember ={};
										this.state.members.forEach((memberItem, i) => {
											if(member === memberItem._id){
												myMember.username = memberItem.username;
												myMember.avatar = memberItem.avatar;
												myMember._id = memberItem._id;
											}
										});
										return myMember;
									})}/>
							))
						}
						</GridList>
				</Container>
			</div>
		);
	}
}

ArchivedTasks.propTypes = {
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
)(withRouter(ArchivedTasks)));
