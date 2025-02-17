document.addEventListener('DOMContentLoaded', () => {

    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // 로그인된 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile && loggedInUser.profile.image) {
        profileImage.src = loggedInUser.profile.image;
    }

    // 드롭다운 메뉴 제어
    profileImage.addEventListener('click', (event) => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        event.stopPropagation();
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

    function formatCount(count) {
        if (count >= 1000) {
            return Math.floor(count / 1000) + 'K';
        }
        return count;
    }

    // 로컬 스토리지에서 posts와 users 데이터를 가져옴
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const postsList = document.querySelector('.posts-list');

    posts.forEach(post => {
        const user = users.find(user => user.id === post.writerId);
        const writerName = user && user.profile ? user.profile.nickname : '알 수 없음';
        const writerImage = user && user.profile ? user.profile.image : '../../dummy/images/default_profile.png';
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
                <img src="${writerImage}" alt="Profile Image" class="post-author-image">
                <span class="post-author-name">${writerName}</span>
            </div>
        `;
        postItem.addEventListener('click', () => {
            window.location.href = `../detail/detail.html?id=${post.id}`;
        });
        postsList.appendChild(postItem);
    });

    // 게시글 작성 버튼 클릭 시 write.html로 이동
    const signupButton = document.getElementById('signup-button');
    signupButton.addEventListener('click', () => {
        window.location.href = '../write/write.html';
    });
});
