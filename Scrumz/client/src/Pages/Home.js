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

import { BoardServices } from '../Models/BoardServices';

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
			boards: [],
			errors: {},
			deleteBoadDialogOpen : false,
			boardIdToDelete : '',
			newBoardDialogOpen: false,
			newBoardName: "",
		};
	}

	componentDidMount() {
		BoardServices.getBoardByUser(this.props.auth.user.id)
			.then(res => {
				this.setState({ boards: res.data });
			})
			.catch(err => { console.log(err) }
			);
	}

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	}

	onNewBoard(newBoard) {
		BoardServices.newboard(newBoard).then(res => {
			var boards = this.state.boards;
			boards.push(res.data);
			this.setState({ boards: boards });
			this.props.history.push(
				{
					pathname: "/board",
					data:
					{
						id: res.data._id,
						user_id : this.props.auth.user.id,
					}
				}
			);
		})
	}

	onDeleteBoard(boardId){
		BoardServices.deleteBoard(boardId).then(res => {
			if (res.data.success){
				var boards = this.state.boards;
				var idToRemove = boards.findIndex(element => { return (element._id === boardId) });
				boards.splice(idToRemove,1);
				this.setState({boards : boards});
			}else{
				console.log('not deleted');
			}
		});
	}

	handleClickOpen = () => {
		this.setState({ newBoardDialogOpen: true });
	};

	handleClose = () => {
		this.setState({ newBoardDialogOpen: false });
	};

	onChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		});
	};

	onSubmit = e => {
		e.preventDefault();

		var id = this.props.auth.user.id;
		var newBoard = {
			name: this.state.newBoardName,
			columns: [],
			members: [id],
			manager: id,
		};
		this.onNewBoard(newBoard);
	};



	render() {
		const { classes } = this.props;

		const boards = this.state.boards.map(board => (
			<Grid item key={board._id}>
				<Card className={classes.cards} >
					<CardActionArea>
						<CardMedia
							component="img"
							alt="Texture"
							height="140"
							image={Texture}
						/>
						<CardContent>
							<Typography>{board.name}</Typography>
						</CardContent>
					</CardActionArea>
					<CardActions>
						<Button color="primary"
							onClick={() => this.props.history.push(
								{
									pathname: "/board",
									data:
									{
										id: board._id,
										user_id : this.props.auth.user.id,
									}
								})
							}>
								See Board
						</Button>
						<Button onClick={()=>{this.setState({boardIdToDelete : board._id, deleteBoadDialogOpen: true})}} color="primary">
							Delete Board
						</Button>
					</CardActions>
				</Card>
			</Grid>
		));

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<div style={{width: 200}} ></div>
						<Button onClick={() => {this.props.history.push("/home")}} className={classes.title} color="inherit">
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
				<h1>Your Board</h1>
				<Grid container spacing={3} justify="center" alignItems="center">
					{boards}
				</Grid>
				<Button
					onClick={this.handleClickOpen}
					variant="contained"
					color="primary"
				>
					new Board
            	</Button>
				<Dialog open={this.state.newBoardDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Create a new board</DialogTitle>
					<form noValidate onSubmit={this.onSubmit}>
						<DialogContent>
							<DialogContentText>
								To create a new board, please enter the Name of the board here.
							</DialogContentText>
							<TextField
								onChange={this.onChange}
								value={this.state.newBoardName}
								id='newBoardName'
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


				<Dialog open={this.state.deleteBoadDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle>Delete the Board ? </DialogTitle>
						<DialogContent>
							<DialogContentText>
								Do you realy want to delete the board ?.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={()=>{this.setState({deleteBoadDialogOpen: false})}} color="primary">
								Cancel
							</Button>
							<Button type="submit" onClick={
									()=>{
										this.onDeleteBoard(this.state.boardIdToDelete);
										this.setState({deleteBoadDialogOpen: false})
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
