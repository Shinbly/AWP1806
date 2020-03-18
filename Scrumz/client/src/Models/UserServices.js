import axios from "axios";

export class UserServices {

    static async getuser(userId) {
        return axios.post("api/users/getuser", { id: userId });
    }


    static async getUserFromEmail(email) {
        return axios.post('api/users/getuserfromemail', { email: email });
    }

    static async getUsersbyIds(ids){
        return axios.post("api/users/getusers", { ids: ids });
    } 

    static async updateUser(updateUser) {
        return axios.post("/api/users/updateuser", updateUser);
    }

}
