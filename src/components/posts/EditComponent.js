import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPost, putPost } from '../../api/postsApi';
import { postImage } from '../../api/imageApi';

const EditComponent = () => {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const loginState = useSelector((state) => state.loginSlice);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPost(postId);
                if (response.message === 'success') {
                    const postData = response.data;
                    setTitle(postData.title);
                    setContent(postData.content);
                    setSelectedFileName(postData.postImageUrl || '');
                } else {
                    setError('Failed to fetch post data');
                }
            } catch (err) {
                setError('Error fetching post data');
            }
        };

        fetchPost();
    }, [postId]);

    useEffect(() => {
        setIsFormValid(title.length > 0 && content.length > 0);
    }, [title, content]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'postImageFile') {
            const file = files[0];
            setPostImageFile(file);
            setSelectedFileName(file ? file.name : '');
        } else {
            if (name === 'title') setTitle(value);
            if (name === 'content') setContent(value);
        }
    };

    const handleBlur = () => {
        if (!title || !content) {
            setError('*제목, 내용을 모두 작성해주세요.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = loginState.id;

        if (!title || !content) {
            setError('*제목, 내용을 모두 작성해주세요.');
            return;
        }

        try {
            let imageUrl = selectedFileName;
            if (postImageFile) {
                const imageResponse = await postImage(postImageFile, 'POST_IMAGE');
                if (imageResponse.message === 'registerSuccess') {
                    imageUrl = imageResponse.data.fileName;
                } else {
                    setError('Error uploading image');
                    return;
                }
            }

            const postData = {
                title,
                content,
                userId: userId,
                postImageUrl: imageUrl
            };

            const response = await putPost(postId, postData);
            if (response.error) {
                setError(response.error);
            } else {
                navigate('/posts/list');
            }
        } catch (err) {
            setError('Error updating post');
        }
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex flex-col items-center pt-16">
            <div className="flex justify-center">
                <div className="text-xl m-4 p-4 font-extrabold text-black">게시글 수정</div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6">
                <div className="mb-4">
                    <label className="block text-md font-extrabold mb-2 p-2" htmlFor="title">
                        제목*
                    </label>
                    <hr className="border-gray-300 my-4" />
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="제목을 입력해주세요. (최대 26글자)"
                        maxLength="26"
                        className="appearance-none w-full py-1 px-2 leading-tight focus:outline-none focus:shadow-outline bg-[#F4F5F7]"
                        required
                    />
                </div>
                <hr className="border-gray-300" />
                <br />

                <div className="mb-4">
                    <label className="block text-md font-extrabold mb-2 p-2" htmlFor="content">
                        내용*
                    </label>
                    <hr className="border-gray-300 my-4" />
                    <textarea
                        name="content"
                        id="content"
                        value={content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="내용을 입력해주세요."
                        className="appearance-none w-full py-1 px-2 leading-tight focus:outline-none focus:shadow-outline bg-[#F4F5F7] h-60"
                        required
                    />
                </div>
                <hr className="border-gray-300 my-4" />

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="mb-4">
                    <label className="block text-md font-extrabold mb-2 p-2" htmlFor="postImageFile">
                        이미지
                    </label>

                    <label
                        htmlFor="postImageFile"
                        className="cursor-pointer inline-block bg-gray-200 border-black py-1 px-2 rounded hover:bg-gray-300 border"
                    >
                        파일 선택
                    </label>
                    <input
                        type="file"
                        name="postImageFile"
                        id="postImageFile"
                        onChange={handleChange}
                        accept=".jpg, .jpeg, .png"
                        style={{ display: 'none' }}
                    />
                    <span className="ml-2">
                        {selectedFileName || '파일을 선택해주세요.'}
                    </span>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className={`font-bold py-2 px-32 rounded-lg focus:outline-none focus:shadow-outline ${isFormValid ? 'bg-[#7F6AEE] hover:bg-[#ACA0EB] text-white' : 'bg-[#ACA0EB] text-white cursor-not-allowed'}`}
                        disabled={!isFormValid}
                    >
                        완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditComponent;
