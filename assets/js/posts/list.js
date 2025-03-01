document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profileImage');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile_image) {
        profileImage.src = loggedInUser.profile_image;
    }
    const posts = postsAPI.getPosts();
    const postsList = document.querySelector('.posts-list');

    posts.forEach(post => {
        const user = usersAPI.getUser(post.wno);
        const writerName = user ? user.nickname : '알 수 없음';
        const writerImage = user && user.profile_image 
            ? user.profile_image 
            : localStorage.getItem('default_profile');
        const shortTitle = post.title.length > 26 ? post.title.substring(0, 26) + '...' : post.title;

        const heartsForPost = heartsAPI.getHeartsByPost(post.pno);
        const likesCount = heartsForPost.length;
        const commentsForPost = commentsAPI.getCommentsByPost(post.pno);
        const commentsCount = commentsForPost.length;
        const views = post.views !== undefined ? post.views : 0;

        const postDateRaw = post.created_at || post.date || '';
        const formattedDate = postDateRaw ? formatter.formatDate(postDateRaw) : '';

        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        postItem.innerHTML = `
            <div class="post-title">${shortTitle}</div>
            <div class="post-middle">
                <div class="post-stats">
                    <span>좋아요: ${formatter.formatCount(likesCount)}</span>
                    <span>댓글: ${formatter.formatCount(commentsCount)}</span>
                    <span>조회수: ${formatter.formatCount(views)}</span>
                </div>
                <div class="post-date">${formattedDate}</div>
            </div>
            <hr class="post-divider">
            <div class="post-footer">
                <img src="${writerImage}" alt="Profile Image" class="post-author-image">
                <span class="post-author-name">${writerName}</span>
            </div>
        `;
        postItem.addEventListener('click', () => {
            window.location.href = `./detail.html?pno=${post.pno}`;
        });
        postsList.appendChild(postItem);
    });

    const createButton = document.getElementById('create-button');
    createButton.addEventListener('click', () => {
        window.location.href = './write.html';
    });
});
