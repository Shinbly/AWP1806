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
		};
	}

	componentDidMount(){
		let columns = {ids: this.props.location.data.columns};
		if (this.props.location.data.columns.length>0){
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


	render () {

	    //const [spacing, setSpacing] = React.useState(2);
	    //const classes = useStyles();
		return (
			<Grid item xs={12}>
			  <Grid container justify="center" spacing={3} >
				{this.state.columns.map((value , index)=> (
				  <Grid key={value._id} item>
					<Paper>
					  <h4>
						{value.name}
					  </h4>
					  <Grid container justify="center" spacing={3}>

						{
						(value.tasks.length > 0) 
						?
						value.tasks.map(task=>(
							<Paper elevation={6}>
								<h4>
									{task.name}
								</h4>
								{task.description}
							</Paper>
						))
						:
						null
						}
					  </Grid>
					  {(index == 0)
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
