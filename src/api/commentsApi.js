import jwtAxios from "../util/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/comments`;

export const postComment = async (commentData) => {
    const formData = new FormData();
    formData.append('postId', commentData.postId);
    formData.append('commenterId', commentData.commenterId);
    formData.append('content', commentData.content);

    const res = await jwtAxios.post(`${prefix}/`, formData)
    return res.data
};

export const getComment = async (commentId) => {
    const res = await jwtAxios.get(`${prefix}/${commentId}`);
    return res.data
}

export const getCommentByPostId = async (postId) => {
    const res = await jwtAxios.get(`${prefix}/posts/${postId}`);
    return res.data
}

export const putComment = async (commentId, commentData) => {
    const formData = new FormData();
    formData.append('commenterId', commentData.commenterId);
    formData.append('content', commentData.content);

    const res = await jwtAxios.put(`${prefix}/${commentId}`, formData);
    return res.data
}

export const deleteComment = async (rno) => {
    const res = await jwtAxios.delete(`${prefix}/${rno}`);
    return res.data
}
