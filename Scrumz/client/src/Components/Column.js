import React from 'react'

function Column (props) {
    const drop = e=> {
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        props.onDragEnd(props.id,task_id);
        const task = document.getElementById(task_id);
        task.style.display = 'block';
        e.target.appendChild(task);


    }
    const dragOver = e => {
        e.preventDefault();
    }

    return(
        <div
            id={props.id}
            className= {props.className}
            onDrop= {drop}
            onDragOver = {dragOver}
        >
            { props.children }
        </div>
    )
}
export default Column