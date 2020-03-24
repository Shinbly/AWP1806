import React from 'react'
import { Card, CardHeader,IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';



function Task (props){

    const dragStart = e=>{
        const target = e.currentTarget;
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
    }


    const drop = e => {
        console.log('dropped on a task ? ');
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        const task = document.getElementById(task_id);
        const column = document.getElementById(props.columnId);
        props.onDragEnd((column.id+'_'+(props.index+1)), task_id);
        e.currentTarget.parentNode.appendChild(task);
        task.style.display = 'block';
    };

    return (
        < Card
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDrop={drop}
            onDragEnd={dragEnd}
            className={props.className}
            key={`task:${props.columnId}_${props.id}`} 
            elevation={6}>
            <CardHeader 
                action={
                <IconButton onClick = {props.onClickEdit} size="small" aria-label="settings">
				    <EditIcon />
				</IconButton>
                }
                title={props.task.name}/>
			{props.task.description}
		</Card>
    )
}

export default Task