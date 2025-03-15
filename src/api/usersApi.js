import axios from 'axios';
import jwtAxios from "../util/jwtUtil"
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/users`
const loginPrefix = `${API_SERVER_HOST}/auth`

export const loginPost = async (loginParam) => {

    const header = {
        headers: {
            "Content-Type": "x-www-form-urlencoded"
        }
    }

    const form = new FormData()
    form.append('username', loginParam.email)
    form.append('password', loginParam.password)

    const res = await axios.post(`${loginPrefix}/tokens`, form, header)
    return res.data
}

export const signupMember = async (member) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const res = await axios.post(`${prefix}/`, member, header);
    return res.data;
}

export const existsEmail = async (email) => {
    const res = await axios.get(`${prefix}/emails/${email}`);
    return res.data;
}

export const existsNickname = async (nickname) => {
    const res = await axios.get(`${prefix}/nicknames/${nickname}`);
    return res.data;
}

export const getMember = async (userId) => {
    const res = await axios.get(`${prefix}/${userId}`);
    return res.data;
}

export const modifyMember = async (userId, member) => {
    if (!userId) {
        throw new Error("User id (userId) is required");
    }
    const res = await jwtAxios.put(`${prefix}/${userId}`, member);
    return res.data;
}

export const changePassword = async (userId, passwordData) => {
    if (!userId) {
        throw new Error("User id (userId) is required");
    }
    const res = await jwtAxios.put(`${prefix}/${userId}/password`, passwordData);
    return res.data;
}

export const removeMember = async (userId) => {
    if (!userId) {
        throw new Error("User id (userId) is required");
    }
    const res = await jwtAxios.delete(`${prefix}/${userId}`);
    return res.data;
}
