import React from 'react'
import { Card, CardActions, CardContent, CardHeader,IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';


function Task (props){

  var draggable = props.draggable;



    const dragStart = e=>{
        e.stopPropagation();
        const target = e.currentTarget;
        e.dataTransfer.setData('task_id', target.id);
        setTimeout(() =>{
            target.style.display = 'none';
        },0);
    }

    const drop = async e =>{
        e.stopPropagation();
        try{
          console.log("drop")
          var target = e.currentTarget.parentNode;
          var id = "";
          while (target.id == ''){
            target = target.parentNode;
          }
          e.preventDefault();
          const task_id = e.dataTransfer.getData('task_id');
          e.dataTransfer.setData('task_id', "");
          if(task_id !== ""){
            const task = document.getElementById(task_id);

            target.style.background = "#eeeeee";
            target.appendChild(document.adoptNode(task));
            id = target.id

            draggable = false;

            var move = {
              user_id : props.user,
              boardId : props.boardId,
              toColumnId: id,
              taskId: task_id,
              index: props.index+1 }
              await props.onDragEnd(move).then(()=>{
                draggable = props.draggable;
              });
          }
        }catch(e){
          console.log(e);
        }

    }




    const dragEnd = e =>{
        e.target.style.display = 'block';
    }

      return (
            <Card
            id={props.id}
            draggable={draggable}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onDrop={drop}
            className={props.className}
            elevation={3}
            style={{ backgroundColor: props.color }}>
            <CardHeader
              action={((props.editIcon !== null) && props.canEdit)  ?
                <IconButton
                  onClick = {props.onClickEdit}
                  size="small"
                  aria-label="settings" >
                  {props.editIcon}
                </IconButton>
                :null
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
                  <Tooltip key = {value._id} title={value.username}>
                    <Avatar alt={value.username} src={value.avatar} />
                  </Tooltip>
                  : (index === 3) ?
                  <Tooltip key = {value._id}  title={props.assignTeamMembers.map(m => { return m.username }).join(' • ')}>
                    <Avatar>+{props.assignTeamMembers.length-3}</Avatar>
                  </Tooltip>
                  : null

                ))}
              </AvatarGroup>
            </CardActions>
          </Card>
      );
}

export default Task
