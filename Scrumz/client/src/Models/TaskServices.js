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

    static async onTaskMoveFromTo(moveData) {
        var taskId = moveData.taskId;
        var fromColumnId = moveData.fromColumnId;
        var toColumnId = moveData.toColumnId;
        var toTaskindex;
        if (moveData.index != null) {
            toTaskindex = moveData.index;
        }
        return ColumnServices.getColumns({ids: [fromColumnId, toColumnId]}).then((res)=>{

            var fromColumn = 0;
            var toColumn = 1;
            var columns = res.data;
            console.log("task getted "+columns)

            var taskIndex = columns[fromColumn].tasks.indexOf(taskId);

            var toTasks = columns[toColumn].tasks;
            var fromTasks = columns[fromColumn].tasks;

            if(toTaskindex!= null){
                toTasks.splice(toTaskindex, 0, fromTasks[taskIndex])
            }else{
                toTasks.push(fromTasks[taskIndex]);
            }
            fromTasks.splice(taskIndex, 1);

            var updateFromColumn = {
                id: fromColumnId,
                tasks:fromTasks
            }
            ColumnServices.updateColumn(updateFromColumn);

            var updateToColumn = {
                id: toColumnId,
                tasks: toTasks
            }
            ColumnServices.updateColumn(updateToColumn);
           
            return {
                from: fromTasks,
                to: toTasks
            };
        });
        
    }

}
