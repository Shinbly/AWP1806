import React from 'react'
import { Card, CardActions, CardContent, CardHeader,IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';


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

        target.style.background = "#eeeeee";
        target.appendChild(document.adoptNode(task));

        var move = {
          user_id : props.user,
          boardId : props.boardId,
          toColumnId: target.id,
          taskId: task_id,
          index: props.index+1 }
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
            elevation={3}
			style={{ backgroundColor: props.color }}>
            <CardHeader
                action={
                <IconButton
                    onClick = {props.onClickEdit}
                    size="small"
                    aria-label="settings" >
                    <EditIcon/>
				</IconButton>
                }
                title={props.task.name}/>
				<CardContent>
					<Typography>
						{props.task.description}
					</Typography>
				</CardContent>
				<CardActions>
					<AvatarGroup>
						{props.assignTeamMembers.map((value, index) => (

								(index < 3) ?
								<Tooltip title={value.username}>
									<Avatar alt={value.username} src={value.avatar} />
								</Tooltip>
								: (index === 3) ?
								<Tooltip title={props.assignTeamMembers.map(m => { return m.username }).join(' • ')}>
									<Avatar>+{props.assignTeamMembers.length-3}</Avatar>
								</Tooltip>
								: null

						))}
					</AvatarGroup>
				</CardActions>
		</Card>
    )
}

export default Task
