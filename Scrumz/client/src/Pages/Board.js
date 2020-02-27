import React, {Component} from 'react';
import classnames from "classnames";
import { Card, CardHeader } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {GridList, GridListTile , Button, IconButton, FormControlLabel, Checkbox} from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  column: {
    width: 170,
  },
  task: {
    paddingBlock : 10,
    backgroundColor : "lighblue",
    width: "90%",
    margin: "auto",
    marginBottom: 10,
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

			titleDialog:"",
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

            errors: {}
        };
    }

    componentDidMount() {
        axios.post("/api/boards/getboardbyid", {id: this.props.location.data.id}).then(res => {
            console.log('board : ', res.data);
            this.setState({board: res.data});
        }).catch(err => {
            console.log(err)
        });
        this.setState({id: this.props.location.data.id, name: this.props.location.data.name});

        let columns = {
            ids: this.props.location.data.columns
        };
        if (this.props.location.data.columns.length > 0) {
            this.getcolumns(columns).then(res => {
                this.setState({columns: res});
            }).catch(err => {
                console.log(err)
            });

        }

    }
    async getcolumns(columnids) {
        return axios.post("/api/columns/getcolumns", columnids).then(async res => {
            return Promise.all(res.data.map(column => {
                if (column.tasks.length > 0) {

                    return axios.post("api/tasks/gettasks", {ids: column.tasks}).then(async res => {
                        return ({_id: column._id, name: column.name, tasks: res.data, movableByMembers: column.movableByMembers, limitation: column.limitation});
                    });
                } else {
                    return ({_id: column._id, name: column.name, tasks: [], movableByMembers: column.movableByMembers, limitation: column.limitation});
                }

            })).then((res) => {
                return res;
            });
        }).catch(err => {
            console.log(err)
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
			titleDialog : 'Create a new column',
			textDialog: "To create a new column, please enter the Name of the column here."});

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
        this.setState({newColumnDialogOpen: false});
    };

    onColumnSubmit = e => {
        e.preventDefault();

        var newColumn = {
            name: this.state.newColumnName,
            tasks: [],
            movableByMembers: this.state.newColumnIsMovable,
            limitation: this.state.newColumnLimitation
        };
		if(this.state.ColumnDialogId ===null){

			var boardId = this.state.id;
			this.onNewColumn(newColumn, boardId);
		}else{
			this.onUpdateColumn(newColumn,this.state.ColumnDialogId);
		}
    };
	onUpdateColumn(updateColumn, id){
		var update = updateColumn;
		update.id = id;
		axios.post("/api/columns/updatecolumn", update).then(res => {
			var columns = this.state.columns;
			columns.forEach((column, i) => {
					if(column._id === id){
						columns[i].name = updateColumn.name;
						columns[i].movableByMembers= updateColumn.newColumnIsMovable;
			            columns[i].limitation= updateColumn.newColumnLimitation;
					}
			});
			this.setState({columns : columns});
		});
	}
    onNewColumn(newColumn, boardId) {
        axios.post("/api/columns/newcolumn", newColumn).then(res => {
            var columns = this.state.columns;
            columns.push(res.data);
            this.setState({columns: columns, newColumnDialogOpen: false, newColumnName: '', newColumnIsMovable: true, newColumnLimitation: 0});
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

            axios.post('/api/boards/updateboard', updateBoard).then(res => {
                console.log('board updated', res.data.newboard);
                this.setState({board: board});
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
			titleDialog : 'Create a new Task.',
			textDialog: "To create a new task, please fill the value here.",
			TaskDialogId: null});

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
            newTaskTest: task.test
        });
    };

    TaskhandleClose = () => {
        this.setState({newTaskDialogOpen: false});
    };

    onTaskSubmit = e => {
        e.preventDefault();

        var newTask = {
            name: this.state.newTaskName,
            description: this.state.newTaskDescription,
            assignTeamMembers: [],
            duration: this.state.newTaskDuration,
            deadLine: this.state.newTaskDeadLine,
            priority: this.state.newTaskPriority,
            acceptance: false,
            test: this.state.newTaskTest
        };

		if(this.state.TaskDialogId === null){
			this.onNewTask(newTask);
		}else{
			this.onUpdateTask(newTask, this.state.TaskDialogId);
		}

    };
	onUpdateTask(updateTask, id){
		var update = updateTask;
		update.id = id;
		axios.post("/api/tasks/updatetask", update)
		.then(res => {
			var columns = this.state.columns;
			var indexColumn = null;
			var indexTask = null;
			columns.forEach((column, iC) => {
				column.tasks.forEach((task, iT) => {
					if(task._id === id){
						indexColumn = iC;
						indexTask = iT;
					}
				});
			});
			updateTask._id = id;
			columns[indexColumn].tasks[indexTask] = updateTask;
			this.setState({columns : columns});

		})
		.catch(err=>{console.log(err);});
	}
    onNewTask(newTask) {
        axios.post("/api/tasks/newtask", newTask).then(res => {
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
                newTaskTest: ''
            });
            var listTaskId = columns[0].tasks.map(task => {
                return task._id
            });
            var updateColumn = {
                id: columns[0]._id,
                tasks: listTaskId
            }
            console.log('updateColumn', updateColumn);
            axios.post('/api/columns/updatecolumn', updateColumn);
        }).catch(err => {
            console.log(err);
        })
    };

    onTaskMove(taskId, fromColumnId, toColumnId) {
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
        axios.post('/api/columns/updatecolumn', updateFromColumn);

        var toTaskIds = columns[toColumn].tasks.map(task => {
            return task._id;
        });
        var updateToColumn = {
            id: toColumnId,
            tasks: toTaskIds
        }
        axios.post('/api/columns/updatecolumn', updateToColumn);
        var log = (`The task : "${columns[toColumn].tasks[columns[toColumn].tasks.length - 1].name}" has been moved from "${columns[fromColumn].name}" to "${columns[toColumn].name}"`);
        console.log(log);
        this.addLogs(log);
        this.setState({columns: columns});
    }

    addLogs(log) {
        var board = this.state.board;
        var newLogs = board.logs;
        newLogs.push(log);
        var updateBoard = {
            id: board._id,
            logs: newLogs
        }
        board.logs = newLogs;

        axios.post('/api/boards/updateboard', updateBoard).then(res => {
            this.setState({board: board});
        }).catch(err => {
            console.log(err);
        });

    }

    render() {
        const { classes } = this.props;

        const {errors} = this.state;
        //const [spacing, setSpacing] = React.useState(2);
        //const classes = useStyles();
        return (<div>
            <h2>{this.state.name}</h2>
            <GridList className={classes.gridList} cols={5}>
                {
                    this.state.columns.map((value, index) => (
					<GridListTile className={classes.gridTile} key={value._id} item>
                        <Card width={500} className={classes.paperColumn} >
                        <CardHeader
                            action={
                              <IconButton onClick = {()=>{this.ColumnhandleClickModify(index)}} size="small" aria-label="settings">
                                <MoreVertIcon />
                              </IconButton>
                            }
                            title={value.name}
                          />
							{(value.limitation > 0) ?
								<h6>
									{`${value.tasks.length} / ${value.limitation}`}
								</h6>
								: null
							}


                                {
                                    (value.tasks.length > 0)
                                        ? value.tasks.map((task, taskIndex) => (
										<Card className={classes.task} key={`task:${value._id}_${task._id}`} elevation={6}>
                                            <CardHeader
                                                action={
                                                  <IconButton onClick = {()=>{this.TaskhandleClickModify(index,taskIndex )}} size="small" aria-label="settings">
                                                    <EditIcon />
                                                  </IconButton>
                                                }
                                                title={task.name}
                                              />
                                            {task.description}
                                            <Button disabled = {index === 0} onClick = {()=>{this.onTaskMove(task._id,value._id,this.state.columns[index-1]._id)}}>
                                                preview
                                            </Button>
                                            <Button disabled = {index === this.state.columns.length -1} onClick= {()=>{this.onTaskMove(task._id,value._id,this.state.columns[index+1]._id)}}>
                                                next
                                            </Button>
                                        </Card>
										)
									)
                                        : null
                                }
                            {
                                (index === 0)
                                    ? <Button onClick={this.TaskhandleClickOpen}>
                                            +Add a Card
                                        </Button>
                                    : null
                            }
                        </Card>
                    </GridListTile >))
                }
            </GridList>
            <Button onClick={this.ColumnhandleClickOpen} variant="contained" color="primary">
                New column
            </Button>
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
							name="name"/>
                        <FormControlLabel
							control=
							{<Checkbox
                            	value = {this.state.newColumnIsMovable}
                            	onChange = {this.onChange}
                            	id = 'newColumnIsMovable'
                            	color = "primary"
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
							className={classnames("", {invalid: errors.nameTask})}
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

        </div>);
    }

}

Board.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({auth: state.auth, errors: state.errors});

export default withStyles(styles)(connect(mapStateToProps)(Board));
