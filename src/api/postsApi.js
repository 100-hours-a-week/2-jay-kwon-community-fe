import jwtAxios from "../util/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/posts`;

export const postPost = async (postData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('postImageUrl', postData.postImageUrl);
    formData.append('userId', postData.userId);

    try {
        const res = await jwtAxios.post(`${prefix}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        return { error: error.response ? error.response.data : error.message };
    }
};

export const getPost = async (postId) => {
    const res = await jwtAxios.get(`${prefix}/${postId}`);
    return res.data
}

export const getCommentsByPostId = async (postId) => {
    const res = await jwtAxios.get(`${prefix}/${postId}/comments`);
    return res.data
}

export const getPostList = async () => {
    const res = await jwtAxios.get(`${prefix}/`);
    return res.data
};

export const putPost = async (postId, postData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('postImageUrl', postData.postImageUrl);
    formData.append('userId', postData.userId);

    const res = await jwtAxios.put(`${prefix}/${postId}`, formData);
    return res.data
}

export const deletePost = async (postId) => {
    try {
        const res = await jwtAxios.delete(`${prefix}/${postId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};
