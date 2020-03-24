import React from 'react'


function Column (props) {

    const drop = e=> {
        var target = e.currentTarget ;
        e.preventDefault();
        const task_id = e.dataTransfer.getData('task_id');
        const oldcolumnId = e.dataTransfer.getData('column_id');
        var move = { toColumnId: props.id, taskId: task_id, index: null}
        const task = document.getElementById(task_id);
        const oldColumn = document.getElementById(oldcolumnId);
        console.log(oldColumn.childNodes);

        const oldColumn = document.getElementById(task.columnId);
        console.log(oldColumn)
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
        console.log(e.currentTarget.children.length);
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
            draggable = {false}
        >
            {props.children}
        </div>
    )
}
export default Column