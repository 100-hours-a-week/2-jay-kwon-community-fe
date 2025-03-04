document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile_image) {
        document.getElementById('profileImage').src = loggedInUser.profile_image;
    }

    let deletionMode = null; // 'comment' 또는 'post'
    let currentDeleteIndex = null; // 삭제할 댓글의 인덱스

    const urlParams = new URLSearchParams(window.location.search);
    const pnoParam = urlParams.get('pno');
    const pno = pnoParam ? parseInt(pnoParam) : null;
    const post = postsAPI.getPost(pno);

    if (post) {
        // 조회수 증가
        post.views = (post.views || 0) + 1;
        postsAPI.updatePost(post);
        renderPostDetails(post);
        initLikes(post);
        initComments(post);

        const modal = document.createElement('div');
        modal.id = 'delete-confirm-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3></h3>
                <p></p>
                <button id="cancel-delete-button" class="button">취소</button>
                <button id="confirm-delete-button" class="button">확인</button>
            </div>
        `;
        document.body.appendChild(modal);

        modalUtil.initModal('delete-confirm-modal', 'cancel-delete-button', 'confirm-delete-button', () => {
            const comments = commentsAPI.getCommentsByPost(post.pno);
            if (deletionMode === 'comment' && currentDeleteIndex !== null) {
                const commentToDelete = comments[currentDeleteIndex];
                if (commentToDelete) {
                    commentsAPI.deleteComment(commentToDelete.cno);
                    location.reload();
                }
            } else if (deletionMode === 'post') {
                postsAPI.deletePost(post.pno);
                window.location.href = './list.html';
            }
            currentDeleteIndex = null;
            deletionMode = null;
        });
    }

    function renderPostDetails(post) {
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = formatter.formatDate(post.created_at || post.date);
        document.getElementById('post-content').textContent = post.content;
        document.getElementById('post-views').textContent = formatter.formatCount(post.views || 0);

        // 작성자 정보 렌더링
        const author = usersAPI.getUser(post.wno);
        if (author) {
            document.getElementById('post-author').textContent = author.nickname;
            const authorImage = document.getElementById('post-author-image');
            authorImage.src = author.profile_image ? author.profile_image : localStorage.getItem('default_profile');
        } else {
            document.getElementById('post-author').textContent = '알 수 없음';
        }

        // 게시글 이미지 렌더링
        if (post.post_image) {
            const postImage = document.getElementById('post-image');
            postImage.src = post.post_image;
            postImage.style.display = 'block';
        }

        // 게시글 수정/삭제 버튼
        const editPostButton = document.getElementById('edit-button');
        const deletePostButton = document.getElementById('delete-button');
        if (loggedInUser && loggedInUser.mno === post.wno) {
            editPostButton.style.display = 'inline-block';
            deletePostButton.style.display = 'inline-block';
            editPostButton.addEventListener('click', () => {
                window.location.href = `./modify.html?pno=${post.pno}`;
            });
            deletePostButton.addEventListener('click', () => {
                deletionMode = 'post';
                modalUtil.openModal('delete-confirm-modal', {
                    title: "게시글을 삭제하시겠습니까?",
                    message: "삭제한 게시글은 복구할 수 없습니다."
                });
            });
        } else {
            editPostButton.style.display = 'none';
            deletePostButton.style.display = 'none';
        }
    }

    function initLikes(post) {
        const likeStatCard = document.querySelectorAll('.stat-card')[0];
        let userHeart = heartsAPI.getHeartByUserAndPost(loggedInUser.mno, post.pno);
        let isLiked = !!userHeart;
        let currentLikes = heartsAPI.getHeartsByPost(post.pno).length;
        likeStatCard.style.backgroundColor = isLiked ? '#ACA0EB' : '#D9D9D9';

        likeStatCard.addEventListener('click', () => {
            if (!isLiked) {
                const newHeart = { mno: loggedInUser.mno, pno: post.pno };
                heartsAPI.createHeart(newHeart);
                isLiked = true;
            } else {
                userHeart = heartsAPI.getHeartByUserAndPost(loggedInUser.mno, post.pno);
                if (userHeart) {
                    heartsAPI.deleteHeart(userHeart.hno);
                }
                isLiked = false;
            }
            currentLikes = heartsAPI.getHeartsByPost(post.pno).length;
            document.getElementById('post-likes').textContent = formatter.formatCount(currentLikes);
            likeStatCard.style.backgroundColor = isLiked ? '#ACA0EB' : '#D9D9D9';
        });
    }

    function initComments(post) {
        const commentInput = document.getElementById('comment-input');
        const commentInputButton = document.getElementById('comment-input-button');
        const commentList = document.getElementById('comment-list');

        let editingIndex = null;

        function renderComments() {
            commentList.innerHTML = '';
            const comments = commentsAPI.getCommentsByPost(post.pno);
            comments.forEach((comment, index) => {
                const commenter = usersAPI.getUser(comment.mno);
                const commenterName = commenter ? commenter.nickname : '알 수 없음';
                const commenterImage = commenter && commenter.profile_image
                    ? commenter.profile_image
                    : localStorage.getItem('default_profile');
                const commentDate = comment.created_at ? formatter.formatDate(comment.created_at) : '';
                const isOwnComment = loggedInUser && comment.mno === loggedInUser.mno;
                const commentCard = document.createElement('div');
                commentCard.className = 'comment-item';
                commentCard.setAttribute('data-index', index);
                commentCard.innerHTML = `
                    <div class="comment-header">
                        <img src="${commenterImage}" alt="Profile Image" class="comment-author-image">
                        <span class="comment-author-name">${commenterName}</span>
                        <span class="comment-date">${commentDate}</span>
                        ${isOwnComment ? `<button class="comment-edit-button">수정</button>
                                          <button class="comment-delete-button">삭제</button>` : ''}
                    </div>
                    <div class="comment-body">
                        <p class="comment-content">${comment.content}</p>
                    </div>
                `;
                commentList.appendChild(commentCard);
            });
            // 댓글 수 업데이트
            document.getElementById('post-comments').textContent = formatter.formatCount(comments.length);
        };

        renderComments();

        // 이벤트 위임을 통해 댓글 수정 및 삭제 버튼 이벤트 처리
        commentList.addEventListener('click', (event) => {
            if (event.target.matches('.comment-edit-button')) {
                const commentCard = event.target.closest('.comment-item');
                const index = commentCard.getAttribute('data-index');
                editingIndex = parseInt(index);
                const content = commentCard.querySelector('.comment-content').textContent;
                commentInput.value = content;
                commentInputButton.innerText = '댓글 수정';
                commentInputButton.disabled = false;
                commentInputButton.style.cursor = 'pointer';
                commentInputButton.style.backgroundColor = '#7F6AEE';
            } else if (event.target.matches('.comment-delete-button')) {
                const commentCard = event.target.closest('.comment-item');
                const index = commentCard.getAttribute('data-index');
                currentDeleteIndex = parseInt(index);
                deletionMode = 'comment';
                modalUtil.openModal('delete-confirm-modal', {
                    title: "댓글을 삭제하시겠습니까?",
                    message: "삭제한 내용은 복구할 수 없습니다."
                });
            }
        });

        // 댓글 입력 버튼 초기 상태 설정
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
            if (editingIndex !== null) {
                const comments = commentsAPI.getCommentsByPost(post.pno);
                const commentToEdit = comments[editingIndex];
                if (commentToEdit) {
                    const updatedComment = {
                        ...commentToEdit,
                        content: content
                    };
                    commentsAPI.updateComment(updatedComment);
                    renderComments();
                    editingIndex = null;
                    commentInput.value = '';
                    commentInputButton.innerText = '댓글 등록';
                }
            } else {
                const newComment = {
                    pno: post.pno,
                    mno: loggedInUser.mno,
                    content: content,
                    created_at: new Date().toISOString()
                };
                commentsAPI.createComment(newComment);
                renderComments();
                commentInput.value = '';
            }
            commentInputButton.disabled = true;
            commentInputButton.style.cursor = 'default';
            commentInputButton.style.backgroundColor = '#ACA0EB';
        });

        renderComments();
    }
});
