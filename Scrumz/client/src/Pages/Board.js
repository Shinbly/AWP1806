import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';

import Backlog from '../Examples/BacklogExemple.json'
import SprintBacklog from '../Examples/SprintBacklog.json'
import Todo from '../Examples/Todo.json'
import Doing from '../Examples/Doing.json'
import ToTest from '../Examples/ToTest.json'
import Done from '../Examples/Done.json'
import { Button } from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import classnames from "classnames";
import axios from "axios";



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

	constructor(){
		super();
		this.state = {
			id: "",
			name: "",
			columns: [],
			tasks : {},
		};
	}

	componentDidMount(){
		let columns = {ids: this.props.location.data.columns};
		var tasks = {};
		axios
			.post("/api/columns/getcolumns", columns)
			.then(res => {
				this.setState({columns: res.data});
			})
			.then(()=>{
				this.state.columns.forEach(column =>
					{
					if(column.tasks.length > 0){
						axios.post("api/tasks/gettasks", {ids : column.tasks}).then(res => {
							var tasks = this.state.tasks;
							res.data.forEach(task => {
								tasks[task._id].push(task);
							});
							this.setState({tasks : tasks})
						});
					}
				});
			}).then(()=>{
				console.log("task =", this.state.tasks);
			})
			.catch(err => {console.log(err)}
		);
	}


	render () {

	    //const [spacing, setSpacing] = React.useState(2);
	    //const classes = useStyles();
		return (
			<Grid item xs={12}>
			  <Grid container justify="center" spacing={3} >
				{this.state.columns.map(value => (
				  <Grid key={value._id} item>
					<Paper>
					  <h4>
						{value.name}
					  </h4>
					  <Grid container justify="center" spacing={3}>
						{value.tasks.map(taskId => (
						  <Paper elevation={6}>
							<h4>
								{taskId}
							</h4>
								{taskId}
						   </Paper>
						))}
					  </Grid>
					  {(value.name == "Backlog")
					  ?
					  <Button>
						+Add a Card
					  </Button>
					  :
					  null}
					</Paper>

				  </Grid>
				))}
			  </Grid>
			</Grid>
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
