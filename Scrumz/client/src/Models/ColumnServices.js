import axios from "axios";

export class ColumnServices {

    static async getColumns(columnids) {
        return axios.post("/api/columns/getcolumns", {ids: columnids});
    }
    static getNbTask(columnid){
        return axios.post("/api/columns/getcolumns", { ids: columnid }).then(res=>{
            var column = res.data[0];
            return column.tasks.length;
        })

    }

    //move data have {toId : idof the column where the task should go, taskId : the id of the task, index : the index where the task go (optionnal)}
    static async movetask(moveData){
      return axios.post('/api/columns/movetask', moveData);
    }

    static async updateColumn(updateColumn) {
        if (updateColumn.tasks != null) {
            var tasks = updateColumn.tasks;
            updateColumn.tasks = tasks.filter((value, index) => { return value != null });
        }
        return axios.post('/api/columns/updatecolumn', updateColumn);
    }

    static async newColumn(newColumn) {
        return axios.post("/api/columns/newcolumn", newColumn);
    }

    static async getColumnByTaskId(id){
        return axios.post("/api/columns/getcolumntaskid", {taskId : id});
    }

	static async deleteColumn(id) {
      return axios.post("/api/columns/deletecolumn", { id: id });
    }

}
