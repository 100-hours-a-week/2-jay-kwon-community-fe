document.addEventListener('DOMContentLoaded', () => {
    
    function formatCount(count) {
        if (count >= 1000) {
            return Math.floor(count / 1000) + 'K';
        }
        return count;
    }
    
    fetch('../../dummy/posts.json')
        .then(response => response.json())
        .then(data => {
            const postsList = document.querySelector('.posts-list');
            data.forEach(post => {
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
                        <span class="post-author-name">${post.writer}</span>
                    </div>
                `;
                postsList.appendChild(postItem);
            });
        })
        .catch(error => console.error('게시글 로드 실패:', error));
});
