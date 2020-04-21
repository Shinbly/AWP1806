import React, { Component } from 'react';
import classnames from "classnames";
import { Card, CardHeader } from '@material-ui/core';
//import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Paper,Drawer, GridList, Grid, GridListTile, Button, IconButton, FormControlLabel, Checkbox } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import DoneIcon from '@material-ui/icons/Done';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Column from '../Components/Column'
import Task from '../Components/Task'


import { BoardServices } from '../Models/BoardServices';
import { ColumnServices } from '../Models/ColumnServices';
import { UserServices } from '../Models/UserServices';
import { TaskServices } from '../Models/TaskServices';

const styles = theme => ({
	column: {
		width: 170,
	},
	task: {
		padding : 0,
		backgroundColor: "lighblue",
		width: "90%",
		margin: "auto",
		marginBottom: 10,
	},
	draggableColumn: {
		margin: 0,
		padding: 0,
		minHeight: '100px',
		height: '130%',
		background: "#eeeeee",
	},
	paperColumn: {
		background: "#eeeeee",
	},
	gridList: {
		flexWrap: 'nowrap',
		// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
		transform: 'translateZ(0)',
	},
	gridTile: {
		maxWidth: "100%",
		height: "100% !important",
	},
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
	},
  paper: {
	  height: 40,
	  width: 40,
	},
	drawer:{
		width : 100,
		flexShrink: 0,
	},
	drawerItem : {
		width : 100,
		height : 50,
	}

});

class Board extends Component {

	constructor() {
		super();
		this.state = {
			id: "",
			board: {},
			name: "",
			columns: [],
			members: [],
			logs : [],

			showLogs : false,

			colors: ["#81ca72","#F5DE33","#FF9F1A","#EF7B6B","#CF92E6","#3394CC","#33CEE6","#51E898","#FF93D5","#5D6A82","#C2C8D1"],
			newTaskColor: "",
			newTaskMembers: [],

			titleDialog: "",
			textDialog: "",

			newColumnDialogOpen: false,
			ColumnDialogId: "",
			newColumnName: '',
			newColumnIsMovable: true,
			newColumnLimitation: 0,

			newTaskDialogOpen: false,
			TaskDialogId: "",
			newTaskName: "",
			newTaskDescription: '',
			newTaskDuration: 0,
			newTaskDeadLine: '',
			newTaskPriority: 2,
			newTaskTest: '',

			addMemberDialogOpen: false,
			newMemberEmail: "",

			//need to reload
			dirty: false,

			errors: {},
		};
	}

	async getForUpdate(boardId){
		var state = {};
		await BoardServices.getboardbyid(boardId).then(async boardData => {
			console.log('board : ', boardData.data);
			var board = boardData.data
			state.board = board;
			state.id = board._id;
			state.name = board.name;

			// this.setState({
			// 	board: board,
			// 	id: board._id,
			// 	name: board.name
			// });

			UserServices.getUsersbyIds(board.members).then((res) => {
				console.log('users : '+res.data);
				this.setState({
					members: res.data
				});
			});
			if (board.columns.length > 0) {
				await this.getcolumns(board.columns).then(async columns => {
					state.columns = columns;
					// this.setState({
					// 	columns: columns
					// });
					var myLogs = [];
					board.logs.forEach((item, i) => {
						var message = item;
						var username = '';
						var user_id = '';
						var time = '';
						try{
							var log = JSON.parse(item);
							var content = JSON.parse(log.content);
							if(log.time != null){
								var d = new Date(log.time);
								time = `${d.getDate()}/${d.getMonth()} ${d.getHours()}:${d.getMinutes()}`;
							}
							if(log.username != null){
								username = log.username;
							}
							if(log.user_id != null){
								user_id = log.user_id;
							}

							if(content.type === 'move'){
								var taskId = content.taskId;
								var fromColumn = content.fromColumn;
								var toColumn =  content.toColumn;
								var taskName ='';
								var fromColumnName ='';
								var toColumnName = '';
								columns.forEach((column, i) => {
									if(fromColumnName === "" && column._id == fromColumn){
										fromColumnName = column.name
									}
									if(toColumnName === "" && column._id == toColumn){
										toColumnName = column.name
									}
									if(taskName === ""){
										column.tasks.forEach((task, i) => {
											if(taskName === "" && task._id == taskId){
												taskName = task.name
											}

										});
									}
								});
								message = `the task ${taskName} has been moved from ${fromColumnName} to the colum ${toColumnName} `;

							}
							if(content.type === 'newMember'){}
							if(content.type === 'newTask'){}
							if(content.type === 'editTask'){}
							if(content.type === 'deleteTask'){}
							if(content.type === 'newColumn'){}
							if(content.type === 'editColumn'){}
							if(content.type === 'deleteColumn'){}

						}catch(e){
						}
						myLogs.push({
							msg : message,
							username : username,
							user_id : user_id,
							time : time,
						})
					});
					state.logs = myLogs;

				}).catch(err => {
					console.log('error column '+err)
				});

			}
			console.log(state);
			this.resetColumnDiv(board.columns);
			this.setState(state);
		}).catch(err => {
			console.log('error board' + err)
		});
	}

	resetColumnDiv(ids){
		ids.forEach((id, i) => {
			var column = document.getElementById(id);
			if (column != null){
				if(column.children.length > 1 ){
						column.childNodes.forEach((item, i) => {
							console.log(item);
							if(item.id != 'init'){
								column.removeChild(item);
							}else{
								console.log(item);
							}

						});

				}
			}
		});

	}

	async update(id){
		await this.getForUpdate(id);
		setTimeout(()=>{
			console.log("updating ...");
			this.update(id)
		},10000);
	}

	componentDidMount() {
		try{
			this.update(this.props.location.data.id);
		}catch(e){
			console.log(e);
			this.props.history.push("/home");
		}
	}
	async getcolumns(columnids) {
		return ColumnServices.getColumns(columnids).then(async res => {
			var columns = res.data;
			console.log('columns' +columns);
			return Promise.all(res.data.map(column => {
				if (column.tasks.length > 0) {
					return TaskServices.getTasks({ids: column.tasks}).then(async res => {
						console.log('tasks '+res.data);
						return ({ _id: column._id, name: column.name, tasks: res.data, movableByMembers: column.movableByMembers, limitation: column.limitation });
					});
				} else {
					return ({ _id: column._id, name: column.name, tasks: [], movableByMembers: column.movableByMembers, limitation: column.limitation });
				}

			})).then((res) => {
				return res;
			});
		}).catch(err => {
			console.log('error : '+err)
		});
	}

	onChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	ColumnhandleClickOpen = () => {
		//used to create a new column
		this.setState({
			newColumnDialogOpen: true,
			ColumnDialogId: null,
			titleDialog: 'Create a new column',
			textDialog: "To create a new column, please enter the Name of the column here."
		});

	};

	ColumnhandleClickModify = (columnindex) => {

		//used to modify a column
		var column = this.state.columns[columnindex];
		this.setState({
			newColumnDialogOpen: true,
			ColumnDialogId: column._id,
			newColumnName: column.name,
			newColumnIsMovable: column.movableByMembers,
			newColumnLimitation: column.limitation,
			titleDialog: 'Modify the Column',
			textDialog: 'You can modify the value of the column here.'
		});
	};

	ColumnhandleClose = () => {
		this.setState({ newColumnDialogOpen: false });
	};

	onColumnSubmit = e => {
		e.preventDefault();

		var newColumn = {
			name: this.state.newColumnName,
			tasks: [],
			movableByMembers: this.state.newColumnIsMovable,
			limitation: this.state.newColumnLimitation
		};
		if (this.state.ColumnDialogId === null) {

			var boardId = this.state.id;
			this.onNewColumn(newColumn, boardId);
		} else {
			this.onUpdateColumn(newColumn, this.state.ColumnDialogId);
		}
	};
	onUpdateColumn(updateColumn, id) {
		var update = updateColumn;
		update.id = id;
		ColumnServices.updateColumn(update).then(res => {
			var columns = this.state.columns;
			columns.forEach((column, i) => {
				if (column._id === id) {
					columns[i].name = updateColumn.name;
					columns[i].movableByMembers = updateColumn.newColumnIsMovable;
					columns[i].limitation = updateColumn.newColumnLimitation;
				}
			});
			this.setState({ columns: columns });
		});
	}
	onNewColumn(newColumn, boardId) {
		ColumnServices.newColumn(newColumn).then(res => {
			var columns = this.state.columns;
			columns.push(res.data);
			this.setState({ columns: columns, newColumnDialogOpen: false, newColumnName: '', newColumnIsMovable: true, newColumnLimitation: 0 });
			var board = this.state.board;
			var listColumnId = board.columns;
			listColumnId.push(res.data._id);
			var newLogs = board.logs;
			newLogs.push(`creation of the column ${res.data.name}`);
			var updateBoard = {
				id: boardId,
				columns: listColumnId,
				logs: newLogs
			}
			board.columns = listColumnId;
			board.logs = newLogs;

			BoardServices.updateboard(updateBoard).then(res => {
				console.log('board updated', res.data.newboard);
				this.setState({ board: board });
			}).catch(err => {
				console.log(err);
			});
		}).catch(err => {
			console.log(err);
		})
	};

	TaskhandleClickOpen = () => {

		this.setState({
			newTaskDialogOpen: true,
			titleDialog: 'Create a new Task.',
			textDialog: "To create a new task, please fill the value here.",
			TaskDialogId: null
		});

	};

	TaskhandleClickModify = (columnindex, taskindex) => {
		var task = this.state.columns[columnindex].tasks[taskindex];
		this.setState({
			newTaskDialogOpen: true,
			titleDialog: 'Modify the Task',
			textDialog: "You can modify the value of the task here.",
			TaskDialogId: task._id,
			newTaskName: task.name,
			newTaskDescription: task.description,
			newTaskDuration: task.duration,
			newTaskDeadLine: task.deadLine,
			newTaskPriority: task.priority,
			newTaskTest: task.test,
			newTaskColor: task.color,
		});
	};

	TaskhandleClose = () => {
		this.setState({ newTaskDialogOpen: false });
	};

	onTaskSubmit = e => {
		e.preventDefault();

		var color = this.state.newTaskColor;
		if(color === null || color === ""){
			color = "#FFFFFF";
		}

		var newTask = {
			name: this.state.newTaskName,
			description: this.state.newTaskDescription,
			assignTeamMembers: [],
			duration: this.state.newTaskDuration,
			deadLine: this.state.newTaskDeadLine,
			priority: this.state.newTaskPriority,
			acceptance: false,
			test: this.state.newTaskTest,
			color: color
		};

		if (this.state.TaskDialogId === null) {
			this.onNewTask(newTask);
		} else {
			this.onUpdateTask(newTask, this.state.TaskDialogId);
		}

	};
	onUpdateTask(updateTask, id) {
		var update = updateTask;
		update.id = id;
		TaskServices.updateTask(update)
			.then(res => {
				var columns = this.state.columns;
				var indexColumn = null;
				var indexTask = null;
				columns.forEach((column, iC) => {
					column.tasks.forEach((task, iT) => {
						if (task._id === id) {
							indexColumn = iC;
							indexTask = iT;
						}
					});
				});
				updateTask._id = id;
				columns[indexColumn].tasks[indexTask] = updateTask;
				this.setState({ columns: columns });

			})
			.catch(err => { console.log(err); });
	}
	onNewTask(newTask) {
		TaskServices.newTask(newTask).then(res => {

			var columns = this.state.columns;
			columns[0].tasks.push(res.data);
			this.setState({
				columns: columns,
				newTaskDialogOpen: false,
				newTaskName: "",
				newTaskDescription: '',
				newTaskDuration: 0,
				newTaskDeadLine: null,
				newTaskPriority: 2,
				newTaskTest: '',
				newTaskColor: "",
			});
			var listTaskId = columns[0].tasks.map(task => {
				return task._id
			});
			var updateColumn = {
				id: columns[0]._id,
				tasks: listTaskId
			}
			console.log('updateColumn', updateColumn);
			ColumnServices.updateColumn(updateColumn);
		}).catch(err => {
			console.log(err);
		})
	};

	onTaskMoveTo(taskId, toColumnId) {
		var fromColumnId = null;
		var columns = this.state.columns;
		for (var i = 0; i < columns.length || fromColumnId == null; i++) {
			var column = columns[i];
			column.tasks.forEach((task) => {
				if (task._id === taskId) {
					fromColumnId = columns[i]._id;
				}
			});
		}
		this.onTaskMoveFromTo(taskId, fromColumnId, toColumnId);
	}

	onTaskMoveFromTo(taskId, fromColumnId, toColumnId) {
		var fromColumn = null;
		var toColumn = null;
		var columns = this.state.columns;
		for (var i = 0; i < columns.length || (fromColumn == null || toColumn == null); i++) {
			if (columns[i]._id === fromColumnId) {
				fromColumn = i;
			}
			if (columns[i]._id === toColumnId) {
				toColumn = i;
			}
		}
		var taskIndex = null;
		columns[fromColumn].tasks.forEach((task, i) => {
			if (task._id === taskId) {
				taskIndex = i;
			}
		});

		columns[toColumn].tasks.push(columns[fromColumn].tasks[taskIndex]);
		columns[fromColumn].tasks.splice(taskIndex, 1);

		var fromTaskIds = columns[fromColumn].tasks.map(task => {
			return task._id;
		});
		var updateFromColumn = {
			id: fromColumnId,
			tasks: fromTaskIds
		}
		ColumnServices.updateColumn(updateFromColumn);

		var toTaskIds = columns[toColumn].tasks.map(task => {
			return task._id;
		});
		var updateToColumn = {
			id: toColumnId,
			tasks: toTaskIds
		}
		ColumnServices.updateColumn(updateToColumn);
		this.setState({ columns: columns });
	}

	MembershandleClose = () => {
		this.setState({ addMemberDialogOpen: false });
	};

	MembershandleClickOpen = () => {
		this.setState({
			addMemberDialogOpen: true,
			titleDialog: 'Add a new Member',
			textDialog: "Type the address mail of the member you whant to add.",
		});
	};

	onMemberSubmit = e => {
		e.preventDefault();

		this.addMembers(this.state.newMemberEmail);

	}


	addMembers(userEmail) {
		var isAMember = false;
		//Verify that the member exists
		UserServices.getUserFromEmail(userEmail).then(res => {
			//If it exist we verify that he is not already a member of the board
			const members = this.state.board.members;

			members.forEach((member, index) => {
				if (member === res.data._id) {
					isAMember = true;
					console.log(member);
					console.log(res.data._id);
				}

				if (index === members.length - 1) {
					if (isAMember) {
						console.log("already a member");
					} else {
						var newMembers = this.state.board.members;

						newMembers.push(res.data._id);

						const update = {
							id: this.state.id,
							members: newMembers,
						};
						BoardServices.addMember(update).then(res => {
							console.log(res);
							var newBoard = this.state.board;
							newBoard.members = newMembers;
							this.setState({ board: newBoard });

							var log = {
							 	type : 'newMember',
							 	memberId : member,
						 	};
							BoardServices.addLogs(newBoard._id, null, log);

						}).catch(err => {
							console.log(err);
						})
					}
				}
			});

		}).catch(err => {
			console.log(err);
		});

	}

	async taskRecieved(move) {
		var columnId = move.toColumnId;
		var taskId = move.taskId;
		var boardId = move.boardId;
		var user = {
			user_id : move.user_id,
			username : move.username,
		}

		if(columnId != null && taskId != null){
			var toColumnId = columnId;
			var index = move.index;
			try{
			await ColumnServices.getColumnByTaskId(taskId).then(async (columnRes) => {
				var fromColumn = columnRes.data;
				if (fromColumn._id !== toColumnId){
					var move={
						taskId: taskId,
						fromColumnId: fromColumn._id,
						toColumnId : toColumnId,
						index : index,
					}
					await TaskServices.onTaskMoveFromTo(move).then(async (res) => {
						console.log('moved');
						var log = {
						 	type : 'move',
						 	taskId : res.taskId,
						 	fromColumn : res.from._id,
						 	toColumn: res.to._id
					 	};

						await BoardServices.addLogs(boardId, user, log);
					});
				}else{
					console.log("start column and target column are the same index = ",index);
					if(index != null){
						await TaskServices.onOrderTask(fromColumn,taskId, index)
					}
				}
			});
		}catch(e){};
	}

	}

	render() {
		const { classes } = this.props;

		const { errors } = this.state;
		//const [spacing, setSpacing] = React.useState(2);
		//const classes = useStyles();

		return (<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
				<Button onClick={() => {this.props.history.push("/home")}} className={classes.title}>
					<Typography variant="h6" className={classes.title}>
						Scrumz
					</Typography>
				</Button>
				<IconButton onClick={()=>{this.setState({showLogs : !this.state.showLogs})}}>
					{this.state.showLogs ? <ChevronRightIcon />: <ChevronLeftIcon/>}
				</IconButton>
				</Toolbar>
			</AppBar>
			<h2>{this.state.name}</h2>
			{
				(this.state.members.length > 0) ?
					<AvatarGroup>
						{this.state.members.map((value, index) => (
							<Tooltip title={value.username}>
								<Avatar alt={value.username} src={value.avatar} />
							</Tooltip>
						))}
						<Tooltip title={this.state.members.map(m => { return m.username }).join(' • ')}>
							<Avatar>+{this.state.members.length}</Avatar>
						</Tooltip>
					</AvatarGroup>
					: null
			}
			<GridList className={classes.gridList} cols={5}>
				{
					this.state.columns.map((value, index) => (
						<GridListTile className={classes.gridTile} key={value._id}>
							<Card width={500} className={classes.paperColumn} >
								<CardHeader
									action={
										<IconButton onClick={() => { this.ColumnhandleClickModify(index) }} size="small" aria-label="settings">
											<MoreVertIcon />
										</IconButton>
									}
									title={value.name}
								/>
							<div>
								<Column id={value._id} className={classes.draggableColumn} onDragEnd={this.taskRecieved} limitation= {value.limitation} user={this.props.auth.user} boardId={this.state.board._id}>

									<div id= 'init'>
										{
											(value.tasks.length > 0)
											?
											value.tasks.map((task, taskIndex) => (
												<div>
													<Task
														id={task._id}
														user={this.props.auth.user}
														boardId={this.state.board._id}
														index={taskIndex}
														className={classes.task}
														task={task}
														onClickEdit={() => {this.TaskhandleClickModify(index, taskIndex)}}
														draggable="true"
														onDragEnd={this.taskRecieved}
														columnid={value._id}
														color={task.color}/>
												</div>
											))
											:
											null
										}
									</div>
									</Column>
							</div>
								{
									(index === 0)
										?
										<Button onClick={this.TaskhandleClickOpen}>
											+Add a Card
                    					</Button>
										:
										null
								}
							</Card>
						</GridListTile >
					))
				}
			</GridList>
			<Button onClick={this.ColumnhandleClickOpen} variant="contained" color="primary">
				New column
            </Button>
			<Button onClick={this.MembershandleClickOpen} variant="contained" color="primary">
				Add members
            </Button>
			<Dialog open={this.state.addMemberDialogOpen} onClose={this.MembershandleClose} aria-labelledby="form-dialog-columntitle">
				<DialogTitle id="form-dialog-columntitle">
					{this.state.titleDialog}
				</DialogTitle>
				<form noValidate="noValidate" onSubmit={this.onMemberSubmit}>
					<DialogContent>
						<DialogContentText>
							{this.state.textDialog}
						</DialogContentText>
						<TextField
							onChange={this.onChange}
							value={this.state.newMemberEmail}
							id='newMemberEmail'
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Email address"
							name="email" />
					</DialogContent>
					<DialogActions>
						<Button onClick={this.MembershandleClose} color="primary">
							Cancel
                        </Button>
						<Button type="submit" onClick={this.MembershandleClose} color="primary">
							Confirm
                        </Button>
					</DialogActions>
				</form>
			</Dialog>

			<Dialog open={this.state.newColumnDialogOpen} onClose={this.ColumnhandleClose} aria-labelledby="form-dialog-columntitle">
				<DialogTitle id="form-dialog-columntitle">
					{this.state.titleDialog}
				</DialogTitle>
				<form noValidate="noValidate" onSubmit={this.onColumnSubmit}>
					<DialogContent>
						<DialogContentText>
							{this.state.textDialog}
						</DialogContentText>
						<TextField
							onChange={this.onChange}
							value={this.state.newColumnName}
							id='newColumnName'
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Name"
							name="name" />
						<FormControlLabel
							control=
							{<Checkbox
								value={this.state.newColumnIsMovable}
								onChange={this.onChange}
								id='newColumnIsMovable'
								color="primary"
							/>}
							label="Movable By Members"
						/>
						<TextField
							value={this.state.newColumnLimitation}
							onChange={this.onChange}
							id='newColumnLimitation'
							label="Limitation"
							type="number"
							InputLabelProps={{
								shrink: true
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.ColumnhandleClose} color="primary">
							Cancel
                        </Button>
						<Button type="submit" onClick={this.ColumnhandleClose} color="primary">
							Confirm
                        </Button>
					</DialogActions>
				</form>
			</Dialog>
			<Dialog open={this.state.newTaskDialogOpen} onClose={this.taskhandleClose} aria-labelledby="form-dialog-tasktitle">
				<DialogTitle id="form-dialog-tasktitle">
					{this.state.titleDialog}
				</DialogTitle>
				<form noValidate="noValidate" onSubmit={this.onTaskSubmit}>
					<DialogContent>
						<DialogContentText>
							{this.state.textDialog}
						</DialogContentText>
						<TextField
							onChange={this.onChange}
							value={this.state.newTaskName}
							id='newTaskName'
							className={classnames("", { invalid: errors.nameTask })}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Name"
							name="name"
						/>
						<span className="red-text">{errors.nameTask}</span>
						<TextField
							onChange={this.onChange}
							value={this.state.newTaskDescription}
							id='newTaskDescription'
							variant="outlined"
							margin="normal"
							fullWidth
							label="Description"
							name="Description"
						/>
						<TextField
							value={this.state.newTaskDuration}
							onChange={this.onChange}
							id='newTaskDuration'
							label="duration (in min)"
							type="number"
							InputLabelProps={{
								shrink: true
							}}
						/>
						<TextField
							onChange={this.onChange}
							value={this.state.newTaskDeadLine}
							id="newTaskDeadLine"
							label="DeadLine"
							type="datetime-local"
							InputLabelProps={{
								shrink: true
							}}
						/>
						<TextField
							onChange={this.onChange}
							value={this.state.newTaskTest}
							id='newTaskTest'
							variant="outlined"
							margin="normal"
							fullWidth
							label="Test"
							name="Test"
						/>
						<Typography style={{paddingTop: 10, paddingBottom: 10,}}>
							Assign task
						</Typography>
						<Grid container spacing={1}>
						  <Grid container item xs={12} spacing={1}>
						  {this.state.members.map((value, index) => (
							  <Grid key={index} container item xs={2} spacing={1} alignItems="center" direction="column">
							  	<IconButton style={{backgroundColor: "grey", width: 50, height: 50, padding: 0}} onClick={() => {
									var members = this.state.newTaskMembers;
									var indexMember = -1;
									members.forEach((member, i) => {
										if(member === value._id){
											indexMember = i;
										}
									});
									if(indexMember === -1){
										members.push(value._id);
										this.setState({newTaskMembers: members});
									}else{
										members.splice(indexMember,1);
										this.setState({newTaskMembers: members});
									}
								}}>

									{
								   (this.state.newTaskMembers.includes(value._id))
									   ?
									   <DoneIcon style={{ color: "white", width: 40, height: 40 }}/> : <Avatar style={{width: 50, height: 50}} alt={value.username} src={value.avatar} />
								  }
								</IconButton>
							  	<Typography>{value.username}</Typography>

							  </Grid>

						  ))}
						  </Grid>
						</Grid>
						<Typography style={{paddingTop: 10, paddingBottom: 10,}}>
							Task color
						</Typography>
						<Grid container spacing={1}>
						  <Grid container item xs={12} spacing={1}>
						  {this.state.colors.map((value, index) => (
							  <Grid key={index} item>
							  {
							 (this.state.newTaskColor !== value)
								 ?
							  	<Button className={classes.paper} style={{ background: value }} onClick={() => {this.setState({newTaskColor: value})}} > </Button>
							  :
							  	<Button startIcon={<DoneIcon style={{ color: "white" }}/>} style={{ background: value }} className={classes.paper} onClick={() => {this.setState({newTaskColor: null})}} > </Button>
							}
							  </Grid>
						  ))}
						  </Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.TaskhandleClose} color="primary">
							Cancel
                        </Button>
						<Button type="submit" onClick={this.TaskhandleClose} color="primary">
							Confirm
                        </Button>
					</DialogActions>
				</form>
			</Dialog>
			<Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={this.state.showLogs}
      >
				<Grid container spacing={1}>
					<Grid container item spacing={1} alignItems="center" direction="column">
						<IconButton onClick={()=>{this.setState({showLogs : false})}}>
	            <ChevronRightIcon />
	          </IconButton>
						{(this.state.board.logs) ?
						this.state.logs.map((log, index) => (
							 <Grid key={index} item>
										<Typography style={{paddingTop: 10, width : 250,}} >{log.username} : {log.msg} - {log.time}</Typography>
										<break/>
							 </Grid>
						)) : null}
					</Grid>
				</Grid>
			</Drawer>

		</div>);
		/*
															<Button disabled={index === 0} onClick={() => { this.onTaskMoveFromTo(task._id, value._id, this.state.columns[index - 1]._id) }}>
														preview
													</Button>
													<Button disabled={index === this.state.columns.length - 1} onClick={() => { this.onTaskMoveFromTo(task._id, value._id, this.state.columns[index + 1]._id) }}>
														next
                        							</Button>
													//<Paper  className={classes[value]} />
		*/
	}

}

Board.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth, errors: state.errors });

export default withStyles(styles)(connect(mapStateToProps)(Board));
