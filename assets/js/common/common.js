document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // 요소가 존재할 때만 이벤트 등록
    if (profileImage && dropdownMenu) {
        // 프로필 이미지 클릭 시 드롭다운 메뉴 토글
        profileImage.addEventListener('click', (event) => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation();
        });
        // 페이지의 다른 곳을 클릭하면 드롭다운 메뉴 숨기기
        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
        });

        // 드롭다운 메뉴 항목 클릭 이벤트 처리
        const menuItems = dropdownMenu.querySelectorAll('li');
        menuItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                if (action === '회원정보 수정') {
                    window.location.href = '/pages/users/modify/info.html';
                } else if (action === '비밀번호 수정') {
                    window.location.href = '/pages/users/modify/password.html';
                } else if (action === '로그아웃') {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/pages/users/login.html';
                }
            });
        });
    }
});
