import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {KeyboardDatePicker} from '@material-ui/pickers';

// const useStyles = makeStyles(theme => ({
//   colomn: {
//     width: 170,
//   },
//   task: {
//     paddingBlock : 10,
//     backgroundColor : "lighblue",
//     width: 145,
//   },
//   control: {
//       padding: theme.spacing(4),
//   },
// }));

class Board extends Component {

	constructor() {
		super();
		this.state = {
			id: "",
			name: "",
			columns: [],
			newColumnDialogOpen : false,
			newColumnName: '',
			newColumnIsMovable: true,
			newColumnLimitation: 0,

			newTaskDialogOpen: false,
			newTaskName : "",
			newTaskDescription : '',
			newTaskDuration: 0,
			newTaskDeadLine: null,
			newTaskPriority: 2,
			newTaskTest: '',



		};
	}

	componentDidMount() {
		this.setState({ id: this.props.location.data.id, name: this.props.location.data.name });
		let columns = { ids: this.props.location.data.columns };
		if (this.props.location.data.columns.length > 0) {
			axios.post("/api/columns/getcolumns", columns)
				.then(async res => {
					var columns = [];
					Promise.all(res.data.map(column => {
						console.log(column);
						if (column.tasks.length > 0) {


							return axios.post("api/tasks/gettasks", { ids: column.tasks }).then(async  res => {
								return (
									{
										_id: column._id,
										name: column.name,
										tasks: res.data,
										movableByMembers: column.movableByMembers,
										limitation: column.limitation,
									}
								);
							});
						} else {
							return (
								{
									_id: column._id,
									name: column.name,
									tasks: [],
									movableByMembers: column.movableByMembers,
									limitation: column.limitation,
								}
							);
						}

					})).then((res) => {
						this.setState({ columns: res });
					});
				})
				.catch(err => { console.log(err) }
				);
		}

	}

	onChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	ColumnhandleClickOpen = () => {
		this.setState({ newColumnDialogOpen: true });
	};

	ColumnhandleClose = () => {
		this.setState({ newColumnDialogOpen: false });
	};

	onColumnSubmit = e => {
		e.preventDefault();

		var newColumn = {
			name: this.state.newColumnName,
			tasks : [],
			movableByMembers: this.state.newColumnIsMovable,
			limitation : this.state.newColumnLimitation,
		};

		this.onNewColumn(newColumn);
	};

	onNewColumn(newColumn) {
		axios.post("/api/columns/newcolumn", newColumn).then(res => {
			var columns = this.state.columns;
			columns.push(res.data);
			this.setState({ 
				columns: columns,
				newColumnDialogOpen: false,
				newColumnName: '',
				newColumnIsMovable: true,
				newColumnLimitation: 0,
			});
		})
	};


	TaskhandleClickOpen = () => {
		this.setState({ newTaskDialogOpen: true });
	};

	TaskhandleClose = () => {
		this.setState({ newTaskDialogOpen: false });
	};

	onTaskSubmit = e => {
		e.preventDefault();

		var newColumn = {
			name: this.state.newTaskName,
			description: this.state.newTaskDescription,
			assignTeamMembers: [],
			duration: this.state.newTaskDuration,
			deadLine : this.state.newTaskDeadLine,
			priority : this.state.newTaskPriority,
			acceptance : false,
			test : this.state.newTaskTest,
		};

		this.onNewTask(newColumn);
	};

	onNewTask(newTask) {
		axios.post("/api/tasks/newtask", newTask).then(res => {
			var columns = this.state.columns;
			columns[0].tasks.push(res.data);
			this.setState({ 
				columns: columns ,
				newTaskDialogOpen: false,
				newTaskName: "",
				newTaskDescription: '',
				newTaskDuration: 0,
				newTaskDeadLine: null,
				newTaskPriority: 2,
				newTaskTest: '',
			});
		})
	};
	




	render() {

		//const [spacing, setSpacing] = React.useState(2);
		//const classes = useStyles();
		return (
			<div>
				<h2>{this.state.name}</h2>
				<Grid item xs={12}>
					<Grid container justify="center" spacing={3} >
						{this.state.columns.map((value, index) => (
							<Grid key={value._id} item>
								<Paper>
									<h4>
										{value.name}
									</h4>
									<Grid container justify="center" spacing={3}>
										{(value.tasks.length > 0)
											?
											value.tasks.map(task => (
												<Paper elevation={6}>
													<h4>
														{task.name}
													</h4>
													{task.description}
												</Paper>
											))
											:
											null}
									</Grid>
									{(index === 0)
										?
										<Button onClick={this.TaskhandleClickOpen}>
											+Add a Card
									</Button>
										:
										null}
								</Paper>
							</Grid>
						))}
					</Grid>
				</Grid>
				<Button
					onClick={this.ColumnhandleClickOpen}
					variant="contained"
					color="primary"
				>
					New column
            	</Button>
				<Dialog open={this.state.newColumnDialogOpen} onClose={this.ColumnhandleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Create a new board</DialogTitle>
					<form noValidate onSubmit={this.onColumnSubmit}>
						<DialogContent>
							<DialogContentText>
								To create a new column, please enter the Name of the column here.
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
								name="name"
							/>
							<FormControlLabel
								control={
									<Checkbox
										value={this.state.newColumnIsMovable}
										onChange={this.onChange}
										id='newColumnIsMovable'
										color="primary"
									/>
								}
								label="Movable By Members"
							/>
							<TextField
								value={this.state.newColumnLimitation}
								onChange={this.onChange}
								id='newColumnLimitation'
								label="Limitation"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.ColumnhandleClose} color="primary">
								Cancel
							</Button>
							<Button type="submit" onClick={this.ColumnhandleClose} color="primary">
								Create
							</Button>
						</DialogActions>
					</form>
				</Dialog>

				<Dialog open={this.state.newTaskDialogOpen} onClose={this.taskhandleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Create a new board</DialogTitle>
					<form noValidate onSubmit={this.onTaskSubmit}>
						<DialogContent>
							<DialogContentText>
								To create a new task, please fill the value here.
							</DialogContentText>
							<TextField
								onChange={this.onChange}
								value={this.state.newTaskName}
								id='newTaskName'
								variant="outlined"
								margin="normal"
								required
								fullWidth
								label="Name"
								name="name"
							/>
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
									shrink: true,
								}}
							/>
							<TextField
								onChange={this.onChange}
								value={this.state.newTaskDeadLine}
								id="newTaskDeadLine"
								label="DeadLine"
								type="datetime-local"
								defaultValue="2017-05-24T10:30"
								InputLabelProps={{
									shrink: true,
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
						</DialogContent>
						<DialogActions>
							<Button onClick={this.TaskhandleClose} color="primary">
								Cancel
							</Button>
							<Button type="submit" onClick={this.TaskhandleClose} color="primary">
								Create
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</div>
		);
	}


}

Board.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps
)(Board);
