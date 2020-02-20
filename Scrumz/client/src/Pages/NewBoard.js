import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";


class NewBoard extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            columns: [{
                name: '',
                movableByMember: true,
                limitation: 0
            }],
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

    onChangeColumn = e => {
        var id = e.target.id;
        var key = e.target.key;
        var columns = this.state.columns;
        columns[key][id] = e.target.value;

        this.setState({
            columns : columns
        });
    };


    createNewBoard = e => {
        var id = this.props.auth.user.id;
        var newBoard = {
            name: `test Board`,
            columns: [],
            nbcolumn : 0,
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

    addColumn(nbColumn) {
        var columns = this.state.columns;
        columns.push({
            name:"",
            movableByMember : "true",
            limitation : 0,
        });
        this.setState({ nbcolumn: nbColumn, columns : columns})
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


    render(){
        const { errors } = this.state;
        const columninfo = [];
        for (var i = 0; i < this.state.nbColumn; i++) {
            columninfo.push(
                <li>
                    <TextField
                        onChange={this.onChangeColumn}
                        value={this.state.columns[i].name}
                        id='name'
                        key = {i}
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
                                onChange={this.onChangeColumn}
                                key = {i}
                                id='movableByMembers'
                                color="primary"
                            />
                        }
                        label="Movable By Members"
                    />
                    <TextField
                        value={this.state.columns[i].limitation}
                        onChange={this.onChangeColumn}
                        id='limitation'
                        key = {i}
                        label="Limitation"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </li>
            );
        };
        const {columns} = (
            <div>
                <ul> 
                    {columninfo} 
                </ul>
                <Button
                    onClick = {this.addColumn(this.setState.nbColumn)}
                >
                    <Icon>add_circle</Icon>
                </Button>
            </div>);

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
