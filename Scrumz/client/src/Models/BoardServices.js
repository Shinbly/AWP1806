import axios from "axios";

export class BoardServices {

  static async newboard(newBoard) {
    return axios.post("/api/boards/newboard", newBoard);
  }

  static async getBoardByUser(userId) {
    return axios.post("/api/boards/getboards", { id: userId });
  }

  static async getboardbyid(id) {
    return axios.post("/api/boards/getboardbyid", { id: id });
  }

  static async addMember(update) {
    return axios.post('api/boards/addmember', update);
  }

  static async updateboard(updateBoard) {
    return axios.post('/api/boards/updateboard', updateBoard);
  }

  static async deleteBoard(id) {
    return axios.post("/api/boards/deleteboard", { id: id });
  }

}