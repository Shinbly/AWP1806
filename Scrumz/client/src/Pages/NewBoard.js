import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

class NewBoard extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            columns: [],
            nbColumn : 2,
            members: [],
            manager: "",
            errors: {}
        };
    }

    componentDidMount() {
        var id = this.props.auth.user.id;
        this.setState( {id: id, members : [id]});
    }


    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };


    createNewBoard = e => {
        var id = this.props.auth.user.id;
        var newBoard = {
            name: `test Board`,
            columns: [],
            nbcolumn : 1,
            members: [id],
            manager: id,
        };
        this.onNewBoard(newBoard);
    }

    onNewBoard(newBoard) {
        axios.post("/api/boards/newboard", newBoard).then(res => {
            var boards = this.state.boards;
            boards.push(res.data);
            this.setState({ boards: boards });
        })
    }


    onSubmit = e => {

        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData); //since we handle the redirect within our component
        //we don't need to pass in this.props.history as a parameter
    };

    column(){
        const columninfo=[];
        for (var i = 0; i < (this.props.order.rounds + 1); i++) {
            columninfo.push(
                <li>
                    <TextField
                        onChange={this.onChange}
                        value={this.state.columns[i].name}
                        id={`columns[${i}].name`}
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
                                checked={this.state.columns[i].movableByMembers}
                                value={this.state.columns[i].movableByMembers}
                                onChange={this.onChange}
                                id={`columns[${i}].movableByMembers`}
                                color="primary"
                            />
                        }
                        label="Movable By Members"
                    />
                    <TextField
                        value={this.state.columns[i].limitation}
                        onChange={this.onChange}
                        id={`columns[${i}].limitation`}
                        label="Limitation"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </li>
            );
        }
        return (
            <div>
                <ul> 
                    {columninfo} 
                </ul>
                <Button
                    onClick = {this.setState({nbcolumn : (this.state.nbColumn+1)})}
                >
                    <Icon>add_circle</Icon>
                </Button>
            </div>
        );
    }

    render(){
        const { errors } = this.state;
        return(
            <form noValidate onSubmit={this.onSubmit}>
                <div>
                    <TextField
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                        className={classnames("", {
                            invalid: errors.name
                        })}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                    />
                    <span className="red-text">{errors.email}</span>
                </div>
                <div>
                    <TextField
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        className={classnames("", {
                            invalid: errors.name
                        })}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                    />
                    <span className="red-text">{errors.email}</span>
                </div>

            </form>
        );
    }
}

NewBoard.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps
)(NewBoard);
