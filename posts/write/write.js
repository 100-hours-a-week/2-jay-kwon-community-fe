document.addEventListener('DOMContentLoaded', () => {

    // 드롭다운 메뉴 기능 구현
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    profileImage.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // 로그인된 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile && loggedInUser.profile.image) {
        const profileImage = document.getElementById('profileImage');
        profileImage.src = loggedInUser.profile.image;
    }

    // 제목 입력 시 26자 제한 처리
    const titleInputEl = document.getElementById('title-input');
    titleInputEl.addEventListener('input', () => {
        if (titleInputEl.value.length > 26) {
            titleInputEl.value = titleInputEl.value.slice(0, 26);
        }
        toggleCompleteButton();
    });

    const completeButton = document.getElementById('complete-button');
    const completeCheckText = document.querySelector('.helper-text .complete-check');
    const contentInputEl = document.getElementById('content-input');

    // 초기 버튼 비활성화 및 스타일 설정
    completeButton.disabled = true;
    completeButton.style.backgroundColor = '#ACA0EB';
    if (completeCheckText) {
        completeCheckText.style.display = 'none';
    }

    // 내용 입력 시 등록 버튼 활성화 여부 체크
    contentInputEl.addEventListener('input', toggleCompleteButton);

    // 제목과 내용 모두 입력되면 버튼 활성화, 그렇지 않으면 비활성화
    function toggleCompleteButton() {
        const title = titleInputEl.value.trim();
        const content = contentInputEl.value.trim();
        if (title && content) {
            completeButton.disabled = false;
            completeButton.style.cursor = 'pointer';
            completeButton.style.backgroundColor = '#7F6AEE';
            if (completeCheckText) completeCheckText.style.display = 'none';
        } else {
            completeButton.disabled = true;
            completeButton.style.cursor = 'default';
            completeButton.style.backgroundColor = '#ACA0EB';
        }
    }

    // 파일 선택 버튼 클릭 시 숨겨진 파일 input 클릭 처리
    const imageUploadButton = document.getElementById('image-upload-button');
    imageUploadButton.addEventListener('click', () => {
        document.getElementById('image-upload').click();
    });

    // 파일 선택 후 파일명 표시
    const fileUploadText = document.getElementById('file-upload-text');
    const imageUploadEl = document.getElementById('image-upload');
    imageUploadEl.addEventListener('change', () => {
        if (imageUploadEl.files && imageUploadEl.files.length > 0) {
            fileUploadText.textContent = imageUploadEl.files[0].name;
        } else {
            fileUploadText.textContent = "파일 선택해주세요.";
        }
    });

    // 등록 버튼 클릭 이벤트 처리
    completeButton.addEventListener('click', () => {
        const titleInput = titleInputEl.value.trim();
        const contentInput = contentInputEl.value.trim();

        // 제목 또는 내용이 빈 경우, 헬퍼 텍스트에 오류 메시지 표시 후 중단
        if (!titleInput || !contentInput) {
            if (completeCheckText) {
                completeCheckText.textContent = "*제목, 내용을 모두 작성해주세요.";
                completeCheckText.style.display = 'block';
            }
            return;
        }

        // 이미지 파일 선택 여부 체크
        const imageUploadEl = document.getElementById('image-upload');
        if (imageUploadEl && imageUploadEl.files && imageUploadEl.files.length > 0) {
            const file = imageUploadEl.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                // 새 게시글 객체 생성 (파일명도 추가)
                const newPost = {
                    id: Date.now(),
                    title: titleInput,
                    content: contentInput, // LONGTEXT 타입과 같이 제한 없이 긴 문자열 저장
                    date: getFormattedDate(), // 날짜 형식 적용
                    likes: 0,
                    views: 0,
                    comments: [],
                    image: event.target.result,
                    imageName: file.name,
                    writerId: loggedInUser ? loggedInUser.id : null
                };

                // 로컬 스토리지에 기존 게시글과 함께 저장
                const posts = JSON.parse(localStorage.getItem('posts')) || [];
                posts.push(newPost);
                localStorage.setItem('posts', JSON.stringify(posts));

                // 게시글 목록 페이지로 이동
                window.location.href = '../list/list.html';
            };
            reader.readAsDataURL(file);
        } else {
            // 새 게시글 객체 생성
            const newPost = {
                id: Date.now(),
                title: titleInput,
                content: contentInput, // LONGTEXT 타입과 같이 제한 없이 긴 문자열 저장
                date: getFormattedDate(), // 날짜 형식 적용
                likes: 0,
                views: 0,
                comments: [],
                writerId: loggedInUser ? loggedInUser.id : null
            };

            // 로컬 스토리지에 기존 게시글과 함께 저장
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));

            // 게시글 목록 페이지로 이동
            window.location.href = '../list/list.html';
        }
    });

    // 날짜 포맷 함수 추가 (yyyy-mm-dd hh:mm:ss)
    function getFormattedDate() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }
});
