import axios from "axios";

export class TaskServices {
    static async newTask(newTask) {
        return axios.post("/api/tasks/newtask", newTask);
    }

    static async getTasks(taskIds) {
        return axios.post("api/users/getuser", { ids: taskIds });
    }

    static async updateTask(taskUpdate) {
        return axios.post("/api/tasks/updatetask", taskUpdate);  
    }

}
