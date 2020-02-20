import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { Button } from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";
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
			columns: []
		};
	}

	componentDidMount(){
		let columns = {ids: this.props.location.data.columns};
		axios
			.post("/api/columns/getcolumns", columns)
			.then(res => {
				this.setState({columns: res.data});
				console.log(this.state.columns);
			})
			.catch(err => {console.log(err)}
		);
	}

	render () {

		console.log(this.props.location.data);
	    //const [spacing, setSpacing] = React.useState(2);
	    //const classes = useStyles();

		return (
			<Grid item xs={12}>
			  <Grid container justify="center" spacing={3} >
				{this.state.columns.map(value => (
				  <Grid key={value} item>
					<Paper>
					  <h4>
						{value.name}
					  </h4>
					  <Grid container justify="center" spacing={3}>
						{value.tasks.map(task => (
						  <Paper elevation={6} className>
							<h4>
								{task.name}
							</h4>
							{task.description}
						   </Paper>
						))}
					  </Grid>
					  {(value.name === "Backlog")
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
