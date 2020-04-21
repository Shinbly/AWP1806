import React from 'react'


function Column (props) {

    const drop = e => {
        e.stopPropagation();
        var target = e.currentTarget ;
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        const task = document.getElementById(task_id);
        target.style.background = "#eeeeee";
        target.appendChild(document.adoptNode(task));

        var move = {
          user_id : props.user.id,
          username : props.user.username ,
          boardId : props.boardId,
          toColumnId: props.id,
          taskId: task_id,
          index: null}
        props.onDragEnd(move).then(res=>{
        });
    };

    const dragOver = e => {
        e.preventDefault();
    };


    return(
        <div
            id={props.id}
            className= {props.className}
            onDrop= {drop}
            onDragOver={dragOver}
            draggable = {false}
        >
            {props.children}
        </div>
    )
}
export default Column
