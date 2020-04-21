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

  static async addLogs(boardId, user, log) {
  		return BoardServices.getboardbyid(boardId).then(res=>{
        var board = res.data;
        var newLogs = board.logs;
        var d = new Date();
        var jsonLog = {
          content : JSON.stringify(log),
          time :  d.getTime(),
        }

		if(user !== null){
			jsonLog.user_id = user.id;
	        jsonLog.username = user.username;
		}


        newLogs.unshift(JSON.stringify(jsonLog));
        //newLogs.splice(0, 10);
        var updateBoard = {
          id: boardId,
          logs: newLogs
        }
        return BoardServices.updateboard(updateBoard)
      });


  	}

}
