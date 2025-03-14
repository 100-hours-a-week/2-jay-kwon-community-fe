import axios from "axios";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/images`;

export const postImage = async (image, imageType) => {
    const formData = new FormData();
    formData.append('fileName', image.name);
    formData.append('file', image);
    formData.append('imageType', imageType);

    try {
        const res = await axios.post(`${prefix}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const getImage = async (imageId) => {
    const res = await axios.get(`${prefix}/${imageId}`);
    return res.data;
};

export const getThumbnail = async (imageId) => {
    const res = await axios.get(`${prefix}/thumbnail/${imageId}`);
    return res.data;
};
