document.addEventListener('DOMContentLoaded', () => {

    const modifyButton = document.getElementById('modify-button');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const passwordHelper = document.querySelector('.helper-text .password');
    const passwordCheckHelper = document.querySelector('.helper-text .password-check');
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    const dropdownMenu = document.getElementById('dropdownMenu');
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
                window.location.href = '../info/info.html';
            } else if (action === '비밀번호 수정') {
                window.location.href = 'password.html';
            } else if (action === '로그아웃') {
                localStorage.removeItem('loggedInUser');
                window.location.href = '../../login/login.html';
            }
        });
    });

    // loggedInUser 정보 가져오기 및 검증
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile) {
        // 헤더 프로필 이미지 업데이트
        const profileImage = document.getElementById('profileImage');
        if (loggedInUser.profile.image) {
            profileImage.src = loggedInUser.profile.image;
        }
        // 이메일 업데이트 (만약 .email 요소가 존재한다면)
        const emailDisplay = document.querySelector('.email');
        if (emailDisplay && loggedInUser.email) {
            emailDisplay.textContent = loggedInUser.email;
        }
    } else {
        // 로그인 정보가 없으면 로그인 페이지로 리디렉션
        window.location.href = '../../login/login.html';
    }

    passwordInput.addEventListener('blur', validatePassword);
    passwordCheckInput.addEventListener('blur', validatePasswordCheck);

    // 초기 상태 설정
    updateModifyButtonState();

    function validatePassword() {
        const passwordValue = passwordInput.value.trim();

        if (!passwordValue) {
            passwordHelper.textContent = '*비밀번호를 입력해주세요';
            passwordHelper.style.display = 'block';
        } else if (!passwordRegex.test(passwordValue)) {
            passwordHelper.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다';
            passwordHelper.style.display = 'block';
        } else {
            passwordHelper.style.display = 'none';
        }
        updateModifyButtonState();
    }

    function validatePasswordCheck() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();

        if (!passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호를 한 번 더 입력해주세요';
            passwordCheckHelper.style.display = 'block';
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
            passwordCheckHelper.style.display = 'block';
        } else {
            passwordCheckHelper.style.display = 'none';
        }
        updateModifyButtonState();
    }

    function updateModifyButtonState() {
        if (isFormValid()) {
            modifyButton.disabled = false;
            modifyButton.style.cursor = 'pointer';
        } else {
            modifyButton.disabled = true;
            modifyButton.style.cursor = 'default';
        }
    }

    function isFormValid() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();

        return (
            passwordValue !== "" &&
            passwordRegex.test(passwordValue) &&
            passwordValue === passwordCheckValue
        );
    }

    modifyButton.addEventListener('click', function (event) {
        event.preventDefault();

        const originalColor = modifyButton.style.backgroundColor;
        modifyButton.style.backgroundColor = "#7F6AEE";

        setTimeout(() => {
            modifyButton.style.backgroundColor = originalColor;
            // 새로운 비밀번호 업데이트
            const newPassword = passwordInput.value.trim();
            // loggedInUser 업데이트
            if (loggedInUser) {
                loggedInUser.password = newPassword;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            }
            // users 배열에서 현재 사용자 업데이트
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.id === loggedInUser.id);
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
            }
            setTimeout(() => {
                showToast();
            }, 500);
        }, 500);
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
});
