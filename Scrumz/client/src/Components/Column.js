import React from 'react'
import { makeStyles } from '@material-ui/core/styles';


function Column (props) {

    const drop = e=> {
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        props.onDragEnd(props.id,task_id);
        const task = document.getElementById(task_id);
        task.style.display = 'block';
        e.currentTarget.appendChild(task);
    };
    const dragOver = e => {
        e.preventDefault();
    };

    const dragEnter = e =>{
        console.log('drag enter');
    };

    const dragLeave = e =>{
        console.log('drag leave');
    };

    return(
        <div
            id={props.id}
            className= {props.className}
            onDrop= {drop}
            onDragOver = {dragOver}
            onDragEnter = {dragEnter}
            onDragLeave = {dragLeave}
        >
            { props.children }
        </div>
    )
}
export default Column