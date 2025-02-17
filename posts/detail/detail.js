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
        if (count >= 100000) return '100K';
        if (count >= 10000) return '10K';
        if (count >= 1000) return '1K';
        return count;
    }

    if (postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(post => post.id === parseInt(postId));
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
            let currentLikes = post.likes; // 원본 좋아요 수

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
            commentList.innerHTML = '';

            post.comments.forEach(comment => {
                const commenter = users.find(u => u.id === comment.writerId);
                const isOwnComment = loggedInUser && comment.writerId === loggedInUser.id;
                const commentCard = document.createElement('div');
                commentCard.className = 'comment-item';
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
            });
        }
    }
});
