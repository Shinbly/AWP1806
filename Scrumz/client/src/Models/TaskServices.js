import axios from "axios";
import { ColumnServices } from '../Models/ColumnServices';


export class TaskServices {
    static async newTask(newTask) {
        return axios.post("/api/tasks/newtask", newTask);
    }

    static async getTasks(taskIds) {
        return axios.post("api/tasks/gettasks", taskIds);
    }

    static async updateTask(taskUpdate) {
        return axios.post("/api/tasks/updatetask", taskUpdate);
    }
    static async onOrderTask(fromColumn, taskId, index){
        var oldIndex = fromColumn.tasks.indexOf(taskId);
        if (oldIndex !== index){
            fromColumn.tasks.splice(oldIndex, 1);
            if(oldIndex < index){
                index -= 1;
            }
            fromColumn.tasks.splice(index , 0, taskId);
        }
    }

    static async onTaskMoveFromTo(moveData) {
        console.log("onMove,", moveData)
        var taskId = moveData.taskId;
        var fromColumnId = moveData.fromColumnId;
        var toColumnId = moveData.toColumnId;
        var toTaskindex;
        if (moveData.index !== null) {
            toTaskindex = moveData.index;
        }
        if (fromColumnId!== null && toColumnId !== null && taskId !== null && fromColumnId !== toColumnId){

            return ColumnServices.getColumns([fromColumnId, toColumnId]).then((res) => {

                var fromColumn = 0;
                var toColumn = 1;
                var columns = res.data;
                console.log('columns',columns)
                if (columns[0]._id === fromColumnId) {
                    fromColumn = 0;
                    toColumn = 1;
                } else {
                    fromColumn = 1;
                    toColumn = 0;
                }
                var taskIndex = columns[fromColumn].tasks.indexOf(taskId);

                var toTasks = columns[toColumn].tasks;
                var fromTasks = columns[fromColumn].tasks;

                if (toTaskindex != null) {
                    toTasks.splice(toTaskindex, 0, fromTasks[taskIndex])
                } else {
                    toTasks.push(fromTasks[taskIndex]);
                }
                fromTasks.splice(taskIndex, 1);

                var updateFromColumn = {
                    id: fromColumnId,
                    tasks: fromTasks
                }
                ColumnServices.updateColumn(updateFromColumn);

                var updateToColumn = {
                    id: toColumnId,
                    tasks: toTasks
                }
                ColumnServices.updateColumn(updateToColumn);

                return {
                    taskId : taskId,
                    from: columns[fromColumn],
                    to: columns[toColumn]
                };
            });
        }else{
            return {
                error: 'fromColumnId == null || toColumnId == null || taskId == null || fromColumnId == toColumnId'
            }
        }

    }

}
