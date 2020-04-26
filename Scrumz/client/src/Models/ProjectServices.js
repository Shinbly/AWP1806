import axios from "axios";

export class ProjectServices {

    static async newProject(newProject) {
      return axios.post("/api/projects/newproject", newProject);
    }

    static async getProjectsByUser(userId) {
      return axios.post("/api/projects/getprojects", { id: userId });
    }

    static async getProjectById(id) {
      return axios.post("/api/projects/getprojectbyid", { id: id });
    }

    static async updateProject(update) {
      return axios.post('/api/projects/updateproject', update);
    }

    static async deleteProject(id) {
      return axios.post("/api/projects/deleteproject", { id: id });
    }
}
