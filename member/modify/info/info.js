document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.profile .image');
    const fileInput = document.getElementById('profile-img-upload');
    const modifyButton = document.getElementById('modify-button');
    const nicknameInput = document.getElementById('nickname');
    const nicknameHelper = document.querySelector('.helper-text .nickname');
    const withdrawalLink = document.getElementById('withdrawal-link');
    const modal = document.getElementById('withdrawal-modal');
    const cancelWithdrawalButton = document.getElementById('cancel-withdrawal');
    const confirmWithdrawalButton = document.getElementById('confirm-withdrawal');
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

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
                window.location.href = 'info.html';
            } else if (action === '비밀번호 수정') {
                window.location.href = '../password/password.html';
            } else if (action === '로그아웃') {
                localStorage.removeItem('loggedInUser');
                window.location.href = '../../login/login.html';
            }
        });
    });

    let oldNickname = "";

    // localStorage에서 로그인된 사용자 정보를 가져옴
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile) {
        oldNickname = loggedInUser.profile.nickname || "";
        nicknameInput.placeholder = oldNickname;

        // 프로필 이미지 업데이트 (변경되어 있다면 imageContainer와 header의 profileImage에도 적용)
        if (loggedInUser.profile.image) {
            imageContainer.style.backgroundImage = `url(${loggedInUser.profile.image})`;
            profileImage.src = loggedInUser.profile.image;
        }
        // 이메일 업데이트: 현재 로그인된 사용자의 이메일을 표시
        if (loggedInUser.email) {
            const emailDisplay = document.querySelector('.email');
            if (emailDisplay) {
                emailDisplay.textContent = loggedInUser.email;
            }
        }
    } else {
        // 로그인 정보가 없는 경우 로그인 페이지로 리디렉션
        window.location.href = '../../login/login.html';
    }

    imageContainer.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                // 프로필 이미지 변경 업데이트
                imageContainer.style.backgroundImage = `url(${imageData})`;
                profileImage.src = imageData;
                // loggedInUser 업데이트
                if (loggedInUser && loggedInUser.profile) {
                    loggedInUser.profile.image = imageData;
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    // users 배열에서 현재 사용자를 찾아 업데이트
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const index = users.findIndex(user => user.id === loggedInUser.id);
                    if (index !== -1) {
                        users[index].profile.image = imageData;
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                }
            };
            reader.readAsDataURL(file);
        } else {
            imageContainer.style.backgroundImage = `url("../../dummy/images/default_profile.png")`;
            imageContainer.style.backgroundColor = '#C4C4C4';
        }
    });

    modifyButton.addEventListener('click', function (event) {
        event.preventDefault();

        let nicknameValue = nicknameInput.value.trim();

        // 입력 칸이 비어 있으면 기존 닉네임으로 대체
        if (nicknameValue === "") {
            nicknameValue = oldNickname;
        }

        // 닉네임이 10자 초과면 오류 메시지 표시
        if (nicknameValue.length > 10) {
            nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다';
            nicknameHelper.style.display = 'block';
            return;
        }

        // 입력된 닉네임이 기존 닉네임과 같다면 중복 검사 없이 통과
        if (nicknameValue === oldNickname) {
            showToast();
            return;
        }

        // users 배열에서 중복 검사 진행
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const isDuplicate = users.some(
            user => user.profile && user.profile.nickname === nicknameValue
        );
        if (isDuplicate) {
            nicknameHelper.textContent = '*중복된 닉네임입니다';
            nicknameHelper.style.display = 'block';
        } else {
            nicknameHelper.style.display = 'none';
            showToast();
            // loggedInUser의 닉네임 업데이트
            if (loggedInUser && loggedInUser.profile) {
                loggedInUser.profile.nickname = nicknameValue;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                // users 배열에서 현재 사용자 정보 업데이트
                const updatedIndex = users.findIndex(user => user.id === loggedInUser.id);
                if (updatedIndex !== -1) {
                    users[updatedIndex].profile.nickname = nicknameValue;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        }
    });

    function showToast() {
        const toast = document.createElement('div');
        toast.textContent = "수정완료";
        toast.className = 'toast-message';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 1000);
    }

    // 회원 탈퇴 모달 제어
    withdrawalLink.addEventListener('click', function (event) {
        event.preventDefault();
        modal.style.display = 'block';
    });

    cancelWithdrawalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    confirmWithdrawalButton.addEventListener('click', function () {
        window.location.href = '../../login/login.html';
    });
});
