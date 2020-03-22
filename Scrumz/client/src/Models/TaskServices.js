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

    static async onTaskMoveFromTo(taskId, fromColumnId, toColumnId) {
        return ColumnServices.getColumns([fromColumnId, toColumnId]).then((columns)=>{
            var fromColumn = 0;
            var toColumn = 1;

            var taskIndex = columns[fromColumn].tasks.indexOf(taskId);

            columns[toColumn].tasks.push(columns[fromColumn].tasks[taskIndex]);
            columns[fromColumn].tasks.splice(taskIndex, 1);

            var updateFromColumn = {
                id: fromColumnId,
                tasks: columns[fromColumn].tasks
            }
            ColumnServices.updateColumn(updateFromColumn);

            var updateToColumn = {
                id: toColumnId,
                tasks: columns[toColumn].tasks
            }
            ColumnServices.updateColumn(updateToColumn);
           
            return {
                from: columns[fromColumn],
                to: columns[toColumn]
            };
        });
        
    }

}
