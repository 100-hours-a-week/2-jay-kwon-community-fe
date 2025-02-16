document.addEventListener('DOMContentLoaded', () => {

    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    profileImage.addEventListener('click', (event) => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        event.stopPropagation();
    });
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });

    function formatCount(count) {
        if (count >= 1000) {
            return Math.floor(count / 1000) + 'K';
        }
        return count;
    }

    // posts.json와 users.json을 동시에 가져와서 작성자 정보를 매칭
    Promise.all([
        fetch('../../dummy/posts.json').then(response => response.json()),
        fetch('../../dummy/users.json').then(response => response.json())
    ])
        .then(([posts, users]) => {
            const postsList = document.querySelector('.posts-list');
            posts.forEach(post => {
                const user = users.find(user => user.id === post.writerId);
                const writerName = user && user.profile ? user.profile.nickname : '알 수 없음';
                const shortTitle = post.title.length > 26 ? post.title.substring(0, 26) + '...' : post.title;
                const postItem = document.createElement('div');
                postItem.className = 'post-item';
                postItem.innerHTML = `
                <div class="post-title">${shortTitle}</div>
                <div class="post-middle">
                    <div class="post-stats">
                        <span>좋아요: ${formatCount(post.likes)}</span>
                        <span>댓글: ${formatCount(post.comments.length)}</span>
                        <span>조회수: ${formatCount(post.views)}</span>
                    </div>
                    <div class="post-date">${post.date}</div>
                </div>
                <hr class="post-divider">
                <div class="post-footer">
                    <img src="../../dummy/images/default.png" alt="Profile Image" class="post-author-image">
                    <span class="post-author-name">${writerName}</span>
                </div>
            `;
                postItem.addEventListener('click', () => {
                    window.location.href = `../detail/detail.html?id=${post.id}`;
                });
                postsList.appendChild(postItem);
            });
        })
        .catch(error => console.error('게시글 로드 실패:', error));
});
