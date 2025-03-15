import jwtAxios from "../util/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/likes/posts`;

export const postPostLike = async (postLikeData) => {
    const formData = new FormData();
    formData.append('postId', postLikeData.postId);
    formData.append('userId', postLikeData.userId);

    const res = await jwtAxios.post(`${prefix}/`, formData)
    return res.data;
};

export const getPostLike = async (postId, userId) => {
    const res = await jwtAxios.get(`${prefix}/${postId}/users/${userId}`);
    return res.data;
};

export const getPostLikeListByBno = async (postId) => {
    const res = await jwtAxios.get(`${prefix}/${postId}`);
    return res.data;
};

export const deletePostLike = async (postId, userId) => {
    const res = await jwtAxios.delete(`${prefix}/${postId}/users/${userId}`);
    return res.data;
};
