document.addEventListener('DOMContentLoaded', () => {

    // 드롭다운 메뉴 기능 구현
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    profileImage.addEventListener('click', (e) => {
        e.stopPropagation(); // 상위 요소로 클릭 이벤트 전파 방지
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });

    // 드롭다운 메뉴 항목 클릭 이벤트 처리
    const menuItems = dropdownMenu.querySelectorAll('li');
    menuItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const action = e.target.textContent.trim();
            if (action === '회원정보 수정') {
                window.location.href = '../../member/modify/info/info.html';
            } else if (action === '비밀번호 수정') {
                window.location.href = '../../member/modify/password/password.html';
            } else if (action === '로그아웃') {
                localStorage.removeItem('loggedInUser');
                window.location.href = '../../login/login.html';
            }
        });
    });

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

        // 삭제 모드: 'comment' 또는 'post'
        let deletionMode = null;
        let currentDeleteIndex = null; // 댓글 삭제 시 인덱스
        let editingIndex = null; // 수정 중인 댓글 인덱스 (없으면 null)

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

            // 게시글 수정, 삭제 버튼 보이기/숨기기 처리
            const editPostButton = document.getElementById('edit-button');
            const deletePostButton = document.getElementById('delete-button');
            if (loggedInUser && loggedInUser.id === post.writerId) {
                editPostButton.style.display = 'inline-block';
                deletePostButton.style.display = 'inline-block';
            } else {
                editPostButton.style.display = 'none';
                deletePostButton.style.display = 'none';
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
                            <img src="${commenter && commenter.profile ? commenter.profile.image : '../../dummy/images/default_profile.png'}" 
                                 alt="Profile Image" class="comment-author-image">
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
                        const deleteButton = commentCard.querySelector('.comment-delete-button');
                        deleteButton.addEventListener('click', () => {
                            currentDeleteIndex = index;
                            deletionMode = 'comment';
                            const modal = document.getElementById('delete-confirm-modal');
                            modal.querySelector('h3').textContent = "댓글을 삭제하시겠습니까?";
                            modal.querySelector('p').textContent = "삭제한 내용은 복구할 수 없습니다.";
                            modal.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                        });
                    }
                });
            };

            renderComments();

            // 모달 내 버튼 이벤트 등록 (댓글, 게시글 삭제 공용)
            const modal = document.getElementById('delete-confirm-modal');
            const cancelDeleteButton = document.getElementById('cancel-delete-button');
            const confirmDeleteButton = document.getElementById('confirm-delete-button');

            cancelDeleteButton.addEventListener('click', () => {
                const modal = document.getElementById('delete-confirm-modal');
                modal.style.display = 'none';
                document.body.style.overflow = '';
                currentDeleteIndex = null;
                deletionMode = null;
            });

            confirmDeleteButton.addEventListener('click', () => {
                if (deletionMode === 'comment' && currentDeleteIndex !== null) {
                    post.comments.splice(currentDeleteIndex, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments();
                } else if (deletionMode === 'post') {
                    // 게시글 삭제 수행 후 목록 페이지로 이동
                    const postIndex = posts.findIndex(p => p.id === post.id);
                    if (postIndex !== -1) {
                        posts.splice(postIndex, 1);
                        localStorage.setItem('posts', JSON.stringify(posts));
                    }
                    window.location.href = '../list/list.html';
                }
                const modal = document.getElementById('delete-confirm-modal');
                modal.style.display = 'none';
                document.body.style.overflow = '';
                currentDeleteIndex = null;
                deletionMode = null;
            });

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
                if (editingIndex !== null) {
                    post.comments[editingIndex].content = content;
                    post.comments[editingIndex].date = new Date().toLocaleString('ko-KR');
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments();
                    editingIndex = null;
                    commentInput.value = '';
                    commentInputButton.innerText = '댓글 등록';
                } else {
                    const newComment = {
                        writerId: loggedInUser.id,
                        content: content,
                        date: new Date().toLocaleString('ko-KR')
                    };
                    post.comments.push(newComment);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments();
                    commentInput.value = '';
                }
                commentInputButton.disabled = true;
                commentInputButton.style.cursor = 'default';
                commentInputButton.style.backgroundColor = '#ACA0EB';
            });

            // 게시글 삭제 버튼 이벤트 등록
            deletePostButton.addEventListener('click', () => {
                deletionMode = 'post';
                const modal = document.getElementById('delete-confirm-modal');
                modal.querySelector('h3').textContent = "게시글을 삭제하시겠습니까?";
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    }
});
