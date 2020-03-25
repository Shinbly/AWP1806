import React from 'react'


function Column (props) {

    const drop = e => {
        e.stopPropagation();
        var target = e.currentTarget ;
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        const task = document.getElementById(task_id);
        var move = { toColumnId: props.id, taskId: task_id, index: null}
        target.style.background = "#eeeeee";
        target.appendChild(document.adoptNode(task));
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