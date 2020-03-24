import React from 'react'
import { Card, CardHeader,IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';



function Task (props){


    const dragStart = e=>{
        const target = e.target;
        e.dataTransfer.setData('task_id', target.id);

        setTimeout(() =>{
            target.style.display = 'none';
        },0);
    }

    const dragOver = e =>{
        e.preventDefault();
    }

    const dragEnd = e =>{
        e.target.style.display = 'block';
        const column = document.getElementById(props.columnId);
        column.style.background = "#eeeeee";
    }


    const drop = e => {
        console.log('dropped on a task ? ');

    };


    const dragEnter = e => {
        const column = document.getElementById(props.columnId);
        column.style.background = 'lightblue';
    };

    const dragLeave = e => {
        const column = document.getElementById(props.columnId);
        column.style.background = "#eeeeee";
    };

    

    return (
        < Card
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDrop={drop}
            onDragEnd={dragEnd}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            className={props.className}
            key={`task:${props.columnId}_${props.id}`} 
            elevation={6}>
            <CardHeader 
                onDrop={drop}
                action={
                <IconButton onDrop={drop} onClick = {props.onClickEdit} size="small" aria-label="settings" >
				    <EditIcon onDrop={drop}/>
				</IconButton>
                }
                title={props.task.name}/>
            <span onDrop={drop}>
			    {props.task.description}
            </span>
		</Card>
    )
}

export default Task