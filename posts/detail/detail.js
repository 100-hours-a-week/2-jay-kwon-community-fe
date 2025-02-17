document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 로그인된 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile && loggedInUser.profile.image) {
        const profileImage = document.getElementById('profileImage');
        profileImage.src = loggedInUser.profile.image;
    }

    function formatCount(count) {
        if (count >= 1000) {
            return Math.floor(count / 1000) + 'K';
        }
        return count;
    }

    if (postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(post => post.id === parseInt(postId));

        const commentInput = document.getElementById('comment-input');
        const commentInputButton = document.getElementById('comment-input-button');

        if (post) {
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-date').textContent = post.date;
            document.getElementById('post-content').textContent = post.content;
            document.getElementById('post-likes').textContent = formatCount(post.likes);
            document.getElementById('post-views').textContent = formatCount(post.views);
            document.getElementById('post-comments').textContent = formatCount(post.comments.length);

            if (post.image) {
                const postImage = document.getElementById('post-image');
                postImage.src = post.image;
                postImage.style.display = 'block';
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.id === post.writerId);
            if (user) {
                document.getElementById('post-author').textContent = user.profile.nickname;
                const authorImage = document.getElementById('post-author-image');
                authorImage.src = user.profile.image;
            } else {
                document.getElementById('post-author').textContent = '알 수 없음';
            }

            // 좋아요수 버튼 기능 구현
            /* 실제로 해당 게시글의 좋아요수에 반영되진 않음 */
            const likeStatCard = document.querySelectorAll('.stat-card')[0];
            let isLiked = false;
            let currentLikes = post.likes;

            likeStatCard.style.backgroundColor = '#D9D9D9';

            likeStatCard.addEventListener('click', () => {
                if (!isLiked) {
                    currentLikes++;
                    likeStatCard.style.backgroundColor = '#ACA0EB';
                    isLiked = true;
                } else {
                    currentLikes--;
                    likeStatCard.style.backgroundColor = '#D9D9D9';
                    isLiked = false;
                }
                document.getElementById('post-likes').textContent = formatCount(currentLikes);
            });

            // 댓글 리스트 렌더링
            const commentList = document.getElementById('comment-list');
            let editingIndex = null; // 수정 중인 댓글의 인덱스 (없으면 null)

            const renderComments = () => {
                commentList.innerHTML = '';
                post.comments.forEach((comment, index) => {
                    const commenter = users.find(u => u.id === comment.writerId);
                    const isOwnComment = loggedInUser && comment.writerId === loggedInUser.id;
                    const commentCard = document.createElement('div');
                    commentCard.className = 'comment-item';
                    commentCard.setAttribute('data-index', index);
                    commentCard.innerHTML = `
                        <div class="comment-header">
                            <img src="${commenter && commenter.profile ? commenter.profile.image : '../../dummy/images/default_profile.png'}" alt="Profile Image" class="comment-author-image">
                            <span class="comment-author-name">
                                ${commenter && commenter.profile ? commenter.profile.nickname : '알 수 없음'}
                            </span>
                            <span class="comment-date">${comment.date}</span>
                            ${isOwnComment ? `<button class="comment-edit-button">수정</button>
                                              <button class="comment-delete-button">삭제</button>` : ''}
                        </div>
                        <div class="comment-body">
                            <p class="comment-content">${comment.content}</p>
                        </div>
                    `;
                    commentList.appendChild(commentCard);

                    if (isOwnComment) {
                        const editButton = commentCard.querySelector('.comment-edit-button');
                        editButton.addEventListener('click', () => {
                            editingIndex = index;
                            commentInput.value = comment.content;
                            commentInputButton.innerText = '댓글 수정';
                            commentInputButton.disabled = false;
                            commentInputButton.style.cursor = 'pointer';
                            commentInputButton.style.backgroundColor = '#7F6AEE';
                        });
                    }
                });
            };

            renderComments();

            // 댓글 입력 버튼 초기 상태: 비활성화
            commentInputButton.disabled = true;
            commentInputButton.style.cursor = 'default';
            commentInputButton.style.backgroundColor = '#ACA0EB';

            commentInput.addEventListener('input', () => {
                if (commentInput.value.trim().length > 0) {
                    commentInputButton.disabled = false;
                    commentInputButton.style.cursor = 'pointer';
                    commentInputButton.style.backgroundColor = '#7F6AEE';
                } else {
                    commentInputButton.disabled = true;
                    commentInputButton.style.cursor = 'default';
                    commentInputButton.style.backgroundColor = '#ACA0EB';
                }
            });

            commentInputButton.addEventListener('click', () => {
                const content = commentInput.value.trim();
                if (!content) return;

                // 수정 모드인 경우
                if (editingIndex !== null) {
                    post.comments[editingIndex].content = content;
                    post.comments[editingIndex].date = new Date().toLocaleString('ko-KR');
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments();
                    editingIndex = null;
                    commentInput.value = '';
                    commentInputButton.innerText = '댓글 등록';
                    commentInputButton.disabled = true;
                    commentInputButton.style.cursor = 'default';
                    commentInputButton.style.backgroundColor = '#ACA0EB';
                } else {
                    // 새로운 댓글 등록
                    const newComment = {
                        writerId: loggedInUser.id,
                        content: content,
                        date: new Date().toLocaleString('ko-KR')
                    };
                    post.comments.push(newComment);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments();
                    commentInput.value = '';
                    commentInputButton.disabled = true;
                    commentInputButton.style.cursor = 'default';
                    commentInputButton.style.backgroundColor = '#ACA0EB';
                }
            });
        }
    }
});
