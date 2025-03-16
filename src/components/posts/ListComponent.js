import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostList } from '../../api/postsApi';
import { formatCount, formatDate, truncateTitle } from '../../util/formatter';
import { getThumbnail } from '../../api/imageApi';

const ListComponent = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPostList();
                if (response.message === 'success') {
                    const postsWithThumbnails = await Promise.all(response.data.map(async post => {
                        const thumbnail = await getThumbnail(post.writerProfileImageUrl || 'default.png');
                        return { ...post, writerProfileImageData: thumbnail.fileContent };
                    }));
                    setPosts(postsWithThumbnails);
                } else {
                    console.error('Failed to fetch posts:', response.message);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleCreatePost = () => {
        navigate('/posts/write');
    };

    const handleCardClick = (postId) => {
        navigate(`/posts/detail/${postId}`);
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex justify-center items-center">
            <div className="mt-10 m-2 p-6 w-full max-w-2xl">
                <div className="flex justify-center">
                    <div className="text-xl m-6 p-6 text-black text-center">안녕하세요,<br/>아무 말 대잔치 <strong className="font-extrabold">게시판</strong> 입니다.</div>
                </div>
                <div className="flex justify-end mb-4">
                    <button className="bg-[#ACA0EB] text-white px-4 py-2 rounded-2xl hover:bg-[#7F6AEE]" onClick={handleCreatePost}>
                        게시글 작성
                    </button>
                </div>
                <div className="post-list">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-5 mb-5 rounded-lg shadow-sm min-h-[180px] cursor-pointer" onClick={() => handleCardClick(post.id)}>
                            <h2 className="text-2xl font-bold mb-4">{truncateTitle(post.title)}</h2>
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-md text-gray-600 mr-4">
                                    좋아요 {formatCount(post.likeCount)} 댓글 {formatCount(post.commentCount)} 조회수 {formatCount(post.viewCount)}
                                </div>
                                <div className="text-md text-gray-500">
                                    {formatDate(post.regDate)}
                                </div>
                            </div>
                            <hr className="w-full border-t border-gray-300 my-1" />
                            <div className="flex justify-start items-center mt-4">
                                <img className="w-6 h-6 rounded-full mr-4" src={`data:image/jpeg;base64,${post.writerProfileImageData}`} alt="Author" />
                                <span className="text-xl text-gray-800">{post.writerNickname}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListComponent;
