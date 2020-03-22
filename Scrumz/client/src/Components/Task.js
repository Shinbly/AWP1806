import React from 'react'

function Task (props){

    const dragStart = e=>{
        const target = e.target;
        e.dataTransfer.setData('task_id', target.id);

        setTimeout(() =>{
            target.style.display = 'none';
        },0);
    }

    const dragOver = e =>{
        e.stopPropagation();
    }

    const dragEnd = e => {
        const target = e.target;
        console.log('dragEnd');
        props.onDragEnd(target.id);
    }
    return (
        <div
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
        >
            {props.children}
        </div>
    )
}

export default Task