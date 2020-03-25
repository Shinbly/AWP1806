import React from 'react'
import { Card, CardHeader,IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';



function Task (props){


    const dragStart = e=>{
        e.stopPropagation();
        const target = e.currentTarget;
        e.dataTransfer.setData('task_id', target.id);
        setTimeout(() =>{
            target.style.display = 'none';
        },0);
    }

    const drop = e =>{
        e.stopPropagation();
        console.log("drop")
        var target = e.currentTarget.parentNode;
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        const task = document.getElementById(task_id);
        var move = { toColumnId: target.id, taskId: task_id, index: props.index+1 }

        target.style.background = "#eeeeee";
        target.appendChild(document.adoptNode(task));
        props.onDragEnd(move).then(res => {});
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
            onDrop={drop}
            className={props.className}
            elevation={3}>
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