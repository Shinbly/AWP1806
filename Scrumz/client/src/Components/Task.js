import React from 'react'
import { Card, CardHeader,IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';



function Task (props){


    const dragStart = e=>{
        const target = e.target;
        e.dataTransfer.setData('task_id', target.id);
        e.dataTransfer.setData('column_id', props.columnId);
        setTimeout(() =>{
            target.style.display = 'none';
        },0);
    }

    const dragEnd = e =>{
        e.target.style.display = 'block';
    }

    return (
        < Card
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            className={props.className}
            columnId = {props.columnId}
            elevation={6}>
            <CardHeader 

                action={
                <IconButton 
                    onClick = {props.onClickEdit} 
                    size="small" 
                    aria-label="settings" >

                    <EditIcon 
                    />
				</IconButton>
                }
                title={props.task.name}/>
            <span 
                >
			    {props.task.description}
            </span>
		</Card>
    )
}

export default Task