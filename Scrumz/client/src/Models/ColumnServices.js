import axios from "axios";

export class ColumnServices {

    static async getColumns(columnids) {
        return axios.post("/api/columns/getcolumns", columnids);
    }

    static async updateColumn(updateColumn) {
        return axios.post('/api/columns/updatecolumn', updateColumn);
    }

    static async newColumn(newColumn) {
        return axios.post("/api/columns/newcolumn", newColumn);
    }

}
