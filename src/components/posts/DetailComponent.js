import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../../api/postsApi';
import { getImage } from '../../api/imageApi';
import { getCommentByPostId, postComment, deleteComment, putComment } from '../../api/commentsApi';
import { getPostLikeListByBno, postPostLike, deletePostLike } from '../../api/postLikesApi';
import { formatDate, formatCount, truncateTitle } from '../../util/formatter';
import useCustomLogin from '../../hooks/useCustomLogin';
import BasicModal from '../modals/BasicModal';
import useModal from '../../hooks/useModal';

const DetailComponent = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [postImage, setPostImage] = useState('');
    const [writerProfileImage, setWriterProfileImage] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const { loginState } = useCustomLogin();
    const [isCommentValid, setIsCommentValid] = useState(false);

    const { isOpen, modalContent, openModal, closeModal } = useModal();
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPost(postId);
                if (response.message === 'success') {
                    const postData = response.data;
                    setPost(postData);
                    if (postData.postImageUrl) {
                        const imageResponse = await getImage(postData.postImageUrl);
                        setPostImage(imageResponse.fileContent);
                    }
                    const profileImageResponse = await getImage(postData.writerProfileImageUrl || 'default.png');
                    setWriterProfileImage(profileImageResponse.fileContent);
                } else {
                    navigate('/posts/list');
                }
            } catch (err) {
                setError('Error fetching post details');
                navigate('/posts/list');
            }
        };

        const fetchComments = async () => {
            try {
                const response = await getCommentByPostId(postId);
                if (response.message === 'success') {
                    const commentsWithImages = await Promise.all(response.data.map(async comment => {
                        const profileImageResponse = await getImage(comment.commenterProfileImageUrl || 'default.png');
                        return { ...comment, commenterProfileImageData: profileImageResponse.fileContent };
                    }));
                    setComments(commentsWithImages);
                } else {
                    setError('Failed to fetch comments');
                }
            } catch (err) {
                setError('Error fetching comments');
            }
        };

        const fetchPostLikes = async () => {
            try {
                const response = await getPostLikeListByBno(postId);
                if (response.message === 'success') {
                    setLikeCount(response.data.length);
                    setHasLiked(response.data.some(like => like.userId === loginState.id));
                } else {
                    setError('Failed to fetch likes');
                }
            } catch (err) {
                setError('Error fetching likes');
            }
        };

        fetchPost();
        fetchComments();
        fetchPostLikes();
    }, [postId, loginState.id, navigate]);

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setNewComment(value);
        setIsCommentValid(value.trim().length > 0);
    };

    const handleEditingCommentChange = (e) => {
        const value = e.target.value;
        setEditingCommentContent(value);
        setIsCommentValid(value.trim().length > 0);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            const commentData = {
                postId,
                commenterId: loginState.id,
                content: newComment
            };
            const response = await postComment(commentData);
            if (response.message === 'registerSuccess') {
                const profileImageResponse = await getImage(loginState.profileImageUrl || 'default.png');
                const newCommentData = {
                    id: response.data.id,
                    content: newComment,
                    createdAt: new Date().toISOString(),
                    commenterNickname: loginState.nickname,
                    commenterProfileImageData: profileImageResponse.fileContent,
                    commenterId: loginState.id
                };
                setComments([...comments, newCommentData]);
                setNewComment('');
                setError('');
                setIsCommentValid(false);
            } else {
                setError('Failed to post comment');
            }
        } catch (err) {
            setError('Error posting comment');
        }
    };

    const handlePostLikeClick = async () => {
        try {
            if (hasLiked) {
                await deletePostLike(postId, loginState.id);
                setLikeCount(likeCount - 1);
            } else {
                await postPostLike({ postId, userId: loginState.id });
                setLikeCount(likeCount + 1);
            }
            setHasLiked(!hasLiked);
        } catch (err) {
            setError('Error updating like');
        }
    };

    const handleEditPost = () => {
        navigate(`/posts/edit/${postId}`);
    };

    const handleDeletePost = () => {
        setDeleteTarget({ type: 'post', id: postId });
        openModal('게시글을 삭제하시겠습니까?', '삭제한 내용은 복구할 수 없습니다.');
    };

    const handleDeleteComment = (commentId) => {
        setDeleteTarget({ type: 'comment', id: commentId });
        openModal('댓글을 삭제하시겠습니까?', '삭제한 내용은 복구할 수 없습니다.');
    };

    const confirmDelete = async () => {
        try {
            if (deleteTarget.type === 'post') {
                await deletePost(deleteTarget.id);
                navigate('/posts/list');
            } else if (deleteTarget.type === 'comment') {
                await deleteComment(deleteTarget.id);
                setComments(comments.filter(comment => comment.id !== deleteTarget.id));
            }
            closeModal();
        } catch (err) {
            setError(`Error deleting ${deleteTarget.type}`);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditingCommentContent(content);
        setIsCommentValid(content.trim().length > 0);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editingCommentContent.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            const commentData = {
                commenterId: loginState.id,
                content: editingCommentContent
            };
            const response = await putComment(editingCommentId, commentData);
            if (response.message === 'modifySuccess') {
                setComments(comments.map(comment =>
                    comment.id === editingCommentId ? { ...comment, content: editingCommentContent } : comment
                ));
                setEditingCommentId(null);
                setEditingCommentContent('');
                setError('');
                setIsCommentValid(false);
            } else {
                setError('Failed to update comment');
            }
        } catch (err) {
            setError('Error updating comment');
        }
    };

    if (error) {
        return <div className="bg-[#F4F5F7] min-h-screen">{error}</div>
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex flex-col items-center pt-16">
            <div className="w-full max-w-2xl p-6">
                <div className="text-xl font-extrabold text-black mb-2">{truncateTitle(post.title)}</div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <img className="w-6 h-6 rounded-full mr-2" src={`data:image/jpeg;base64,${writerProfileImage}`} alt="Author" />
                        <span className="text-md p-2 mr-2">{post.writerNickname}</span>
                        <span className="text-md text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    {loginState.id === post.writerId && (
                        <div className="text-md text-black flex items-center justify-end">
                            <button
                                onClick={handleEditPost}
                                className="ml-2 border border-[#7F6AEE] rounded-xl px-3 py-1 hover:bg-[#7F6AEE] hover:text-white"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="ml-2 border border-[#7F6AEE] rounded-xl px-3 py-1 hover:bg-[#7F6AEE] hover:text-white"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
                <hr className="border-gray-300 my-4" />

                {postImage && (
                    <div className="mb-4">
                        <img src={`data:image/jpeg;base64,${postImage}`} alt="Post" className="w-full h-auto" />
                    </div>
                )}
                <div className="text-lg mb-4">{post.content}</div>

                <div className="flex justify-center items-center gap-x-4">
                    <button onClick={handlePostLikeClick} className={`w-28 text-center px-4 py-2 rounded-xl ${hasLiked ? 'bg-[#ACA0EB] text-white' : 'bg-[#D9D9D9] text-black'}`}>
                        {hasLiked ? (
                            <>
                                {likeCount}
                                <br />
                                좋아요수
                            </>
                        ) : (
                            <>
                                {likeCount}
                                <br />
                                좋아요수
                            </>
                        )}
                    </button>
                    <button className="w-28 text-center px-4 py-2 rounded-xl bg-[#D9D9D9] text-black">
                        <span>{formatCount(post.viewCount)}</span>
                        <br />
                        <span>조회수</span>
                    </button>
                    <button className="w-28 text-center px-4 py-2 rounded-xl bg-[#D9D9D9] text-black">
                        <span>{formatCount(comments.length)}</span>
                        <br />
                        <span>댓글수</span>
                    </button>
                </div>
                <hr className="border-gray-300 my-4" />

                <div className="bg-white p-4 rounded-xl shadow-md mt-4 w-full mb-8">
                    <form onSubmit={editingCommentId ? handleUpdateComment : handleCommentSubmit}>
                        <textarea
                            value={editingCommentId ? editingCommentContent : newComment}
                            onChange={editingCommentId ? handleEditingCommentChange : handleCommentChange}
                            placeholder="댓글을 남겨주세요!"
                            className="appearance-none w-full py-1 px-2 leading-tight focus:outline-none focus:shadow-outline h-20"
                        />
                        <hr className="border-gray-300 my-4" />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={`mt-2 bg-[#ACA0EB] text-white px-4 py-2 rounded-2xl ${isCommentValid ? 'hover:bg-[#7F6AEE]' : 'cursor-not-allowed hover:bg-[#ACA0EB]'}`}
                                disabled={!isCommentValid}
                            >
                                {editingCommentId ? '댓글 수정' : '댓글 등록'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="comments-section">
                    {comments.map(comment => (
                        <div key={comment.id} className="mb-4 flex items-start">
                            {comment.commenterProfileImageData && (
                                <img className="w-6 h-6 rounded-full mr-2" src={`data:image/jpeg;base64,${comment.commenterProfileImageData}`} alt="Commenter" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-bold">{comment.commenterNickname}</span>
                                        <span className="text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    {loginState.id === comment.commenterId && (
                                        <div className="text-md text-black flex items-center justify-end">
                                            <button
                                                onClick={() => handleEditComment(comment.id, comment.content)}
                                                className="ml-2 border border-[#7F6AEE] rounded-xl px-3 py-1 hover:bg-[#7F6AEE] hover:text-white">
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="ml-2 border border-[#7F6AEE] rounded-xl px-3 py-1 hover:bg-[#7F6AEE] hover:text-white">
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-3 break-words whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BasicModal
                isOpen={isOpen}
                title={modalContent.title}
                message={modalContent.message}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default DetailComponent;
