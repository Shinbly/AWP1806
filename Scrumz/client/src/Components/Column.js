import React from 'react'


function Column (props) {

    const drop = e=> {
        var target = e.currentTarget
        console.log('columnDrop');
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');

        var move = { toColumnId: props.id, taskId: task_id, index: null}
        const task = document.getElementById(task_id);
        target.style.background = "#eeeeee";
        target.appendChild(task);
        props.onDragEnd(move).then(res=>{
            task.style.display = 'block';
        });
    };
    const dragOver = e => {
        e.preventDefault();
    };

    const dragEnter = e =>{
        e.currentTarget.style.background = 'lightblue';
    };

    const dragLeave = e =>{
        e.currentTarget.style.background = "#eeeeee";
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
            {props.children}
        </div>
    )
}
export default Column