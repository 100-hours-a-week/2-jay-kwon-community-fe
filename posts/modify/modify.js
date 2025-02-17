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

    // 수정할 게시글 정보 불러오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get("id"));
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex((p) => p.id === postId);
    const post = posts[postIndex];

    // 요소 가져오기
    const titleInputEl = document.getElementById("title-input");
    const contentInputEl = document.getElementById("content-input");
    const completeButton = document.getElementById("complete-button");
    const completeCheckText = document.querySelector(".helper-text .complete-check");
    const imageUploadEl = document.getElementById("image-upload");
    const imageUploadButton = document.getElementById("image-upload-button");
    const fileUploadText = document.getElementById("file-upload-text");

    // 초기 입력값 세팅 (게시글 정보가 있을 경우)
    if (post) {
        titleInputEl.value = post.title;
        contentInputEl.value = post.content;
        if (post.image && post.imageName) {
            fileUploadText.textContent = post.imageName;
        } else {
            fileUploadText.textContent = "파일을 선택해주세요.";
        }
    }

    // 제목 입력 시 26자 제한 처리
    titleInputEl.addEventListener('input', () => {
        if (titleInputEl.value.length > 26) {
            titleInputEl.value = titleInputEl.value.slice(0, 26);
        }
        toggleCompleteButton();
    });

    // 내용 입력 시 등록 버튼 활성화 여부 체크
    contentInputEl.addEventListener('input', toggleCompleteButton);

    // 초기 버튼 비활성화 및 스타일 설정
    completeButton.disabled = true;
    completeButton.style.backgroundColor = '#ACA0EB';
    if (completeCheckText) {
        completeCheckText.style.display = 'none';
    }

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

    // 초기 입력값 세팅 이후 한 번 호출하여 수정 버튼 활성화 처리
    toggleCompleteButton();

    // 파일 선택 버튼 클릭 시 숨겨진 파일 input 클릭 처리
    imageUploadButton.addEventListener('click', () => {
        imageUploadEl.click();
    });

    // 파일 선택 후 파일명 표시
    imageUploadEl.addEventListener('change', () => {
        if (imageUploadEl.files && imageUploadEl.files.length > 0) {
            fileUploadText.textContent = imageUploadEl.files[0].name;
        } else {
            fileUploadText.textContent = "파일을 선택해주세요.";
            post.image = null;
            post.imageName = null;
        }
    });

    // 수정 버튼 클릭 이벤트 처리 (게시글 업데이트)
    completeButton.addEventListener("click", () => {
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

        // 이미지 파일 선택 여부 체크하여 게시글 업데이트
        if (imageUploadEl && imageUploadEl.files && imageUploadEl.files.length > 0) {
            const file = imageUploadEl.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                post.title = titleInput;
                post.content = contentInput;
                post.image = event.target.result;
                post.imageName = file.name; // 선택한 파일의 이름 저장
                post.date = getFormattedDate(); // 날짜 형식 적용
                // 업데이트된 게시글 저장
                posts[postIndex] = post;
                localStorage.setItem("posts", JSON.stringify(posts));
                // 상세 페이지로 이동 (수정된 게시글 id 포함)
                window.location.href = "../detail/detail.html?id=" + post.id;
            };
            reader.readAsDataURL(file);
        } else {
            // 이미지가 선택되지 않은 경우 기존 이미지 유지
            post.title = titleInput;
            post.content = contentInput;
            post.date = getFormattedDate(); // 날짜 형식 적용
            posts[postIndex] = post;
            localStorage.setItem("posts", JSON.stringify(posts));
            window.location.href = "../detail/detail.html?id=" + post.id;
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
