import axios from "axios";

export class BoardServices {

  static async newboard(newBoard) {
    return axios.post(`/api/boards/newboard`, newBoard);
  }

  static async getBoardByUser(userId) {
    return axios.post(`/api/boards/getboards`, { id: userId });
  }

  static async getBoardById(id) {
    return axios.post(`/api/boards/getboardbyid`, { id: id });
  }
  static async getBoardsByIds(ids) {
    return axios.post(`/api/boards/getboardsbyids`, { ids: ids });
  }

  static async updateMember(update) {
    return axios.post(`/api/boards/updatemember`, update);
  }

  static async updateBoard(updateBoard) {
    return axios.post(`/api/boards/updateboard`, updateBoard);
  }

  static async deleteBoard(id) {
    return axios.post(`/api/boards/deleteboard`, { id: id });
  }

  static async addLogs(boardId, userId, log) {
  		return BoardServices.getBoardById(boardId).then(res=>{
        var board = res.data;
        var newLogs = board.logs;
        var d = new Date();
        var jsonLog = {
          content : JSON.stringify(log),
          time :  d.getTime(),
        }

		if(userId !== null){
			jsonLog.user_id = userId;
		}


        newLogs.unshift(JSON.stringify(jsonLog));
        //newLogs.splice(0, 10);
        var updateBoard = {
          id: boardId,
          logs: newLogs
        }
        return BoardServices.updateBoard(updateBoard);
      }).catch(e=>{
        console.log('error adding log : \n'+e);
      });


  	}

}
