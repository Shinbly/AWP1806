import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
//import axios from "axios";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
//import avatarDefault from "../Assets/UserProfile.png";
import {Grid, Button} from '@material-ui/core';

import Task from '../Components/Task'

import { BoardServices } from '../Models/BoardServices';
import { TaskServices } from '../Models/TaskServices';
import { ColumnServices } from '../Models/ColumnServices';

import UnarchiveIcon from '@material-ui/icons/Unarchive';

const styles = theme => ({
	task: {
		padding : 0,
		backgroundColor: "lighblue",
		width: 170,
		marginLeft: 20,
		marginRight: 20,
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
			board: {},
			archived_tasks: [],
			members : [],
		};
	}

	componentDidMount() {
		try{
			var boardId = this.props.match.params.boardId;
			var userId = this.props.auth.user.id;
			var members = [];


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
						board: board,
						archived_tasks: archivedTasks,
						members : members,
					});
				});
			});
		}catch(e){
			console.log(e);
			//this.props.history.push("/home");
		}
	}

	async unarchive(taskId){
		var tasks = this.state.archived_tasks.filter((value, index) => { return value._id !== taskId });
		var boardUpdate = {
			id : this.state.boardId,
			archived_tasks : tasks,
		}
		await BoardServices.updateBoard(boardUpdate).then(async ()=>{
			await ColumnServices.getColumns([this.state.board.columns[0]]).then(async (res)=>{
				var column = res.data[0];
				column.tasks.push(taskId);
				var update = {
					id : column._id,
					tasks : column.tasks,
				}
				await ColumnServices.updateColumn(update).then(async()=>{
					var log = {
						type : 'unarchiveTask',
						taskId : taskId,
					};
					await BoardServices.addLogs(this.state.boardId, this.state.userId, log);
					this.setState({archived_tasks : tasks});

				});
			})

		})

	}

	render() {
		const { errors } = this.state;

		const { classes } = this.props;

		return (
			<div className={classes.root}>

				<AppBar position="static">
					<Toolbar>
					<Button color="inherit"
						onClick={() => this.props.history.push(`/board/${this.props.match.params.boardId}`)}>
							See Board
					</Button>
						<Button onClick={() => {this.props.history.push("/home")}} className={classes.title} color="inherit">
							<Typography variant="h6" className={classes.title}>
								Scrumz
			  				</Typography>
						</Button>
					</Toolbar>
				</AppBar>
					{this.state.archived_tasks.length > 0  ?
						<Grid style={{marginBottom: 50, marginTop: 50, marginLeft: 50, marginRight: 50}} container spacing={3} justify="center" alignItems="center">
							{
								this.state.archived_tasks.map((task, index) => (
									<Task
										canEdit = {(this.state.user_id === this.state.board.manager)}
										editIcon = {<UnarchiveIcon/>}
										id={task._id}
										user={this.state.userId}
										boardId={this.state.boardId}
										index={index}
										className={classes.task}
										task={task}
										onClickEdit={()=>{this.unarchive(task._id);}}
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
							</Grid>
						 : <Typography>No task archived</Typography>}

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
