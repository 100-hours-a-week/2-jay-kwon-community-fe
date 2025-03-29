import jwtAxios from "../util/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const postPrefix = `${API_SERVER_HOST}/posts`;

export const postPostLike = async (postId, userId) => {
    const prefix = `${postPrefix}/${postId}/likes`;
    const res = await jwtAxios.post(`${prefix}/users/${userId}`);
    return res.data;
};

export const getPostLike = async (postId, userId) => {
    const prefix = `${postPrefix}/${postId}/likes`;
    const res = await jwtAxios.get(`${prefix}/users/${userId}`);
    return res.data;
};

export const deletePostLike = async (postId, userId) => {
    const prefix = `${postPrefix}/${postId}/likes`;
    const res = await jwtAxios.delete(`${prefix}/users/${userId}`);
    return res.data;
};
