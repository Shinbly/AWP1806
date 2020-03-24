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

}
