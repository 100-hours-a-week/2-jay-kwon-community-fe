document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const nicknameInput = document.getElementById('nickname');
    const signupButton = document.getElementById('signup-button');

    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    passwordCheckInput.addEventListener('blur', validatePasswordCheck);
    nicknameInput.addEventListener('blur', validateNickname);

    // 초기 상태 설정
    updateSignupButtonState();

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailHelper = document.querySelector('.helper-text .email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === "") {
            emailHelper.textContent = '*이메일을 입력해주세요';
            emailHelper.style.display = 'block';
        } else if (emailValue.length < 5 || !emailRegex.test(emailValue)) {
            emailHelper.textContent = '*올바른 이메일 주소 형식을 입력해주세요';
            emailHelper.style.display = 'block';
        } else {
            emailHelper.style.display = 'none';
        }
        updateSignupButtonState();
    }

    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        const passwordHelper = document.querySelector('.helper-text .password');
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

        if (!passwordValue) {
            passwordHelper.textContent = '*비밀번호를 입력해주세요';
            passwordHelper.style.display = 'block';
        } else if (!passwordRegex.test(passwordValue)) {
            passwordHelper.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다';
            passwordHelper.style.display = 'block';
        } else {
            passwordHelper.style.display = 'none';
        }
        updateSignupButtonState();
    }

    function validatePasswordCheck() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const passwordCheckHelper = document.querySelector('.helper-text .password-check');

        if (!passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호를 한 번 더 입력해주세요';
            passwordCheckHelper.style.display = 'block';
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
            passwordCheckHelper.style.display = 'block';
        } else {
            passwordCheckHelper.style.display = 'none';
        }
        updateSignupButtonState();
    }

    function validateNickname() {
        const nicknameValue = nicknameInput.value.trim();
        const nicknameHelper = document.querySelector('.helper-text .nickname');

        if (!nicknameValue) {
            nicknameHelper.textContent = '*닉네임을 입력해주세요';
            nicknameHelper.style.display = 'block';
        } else if (/\s/.test(nicknameValue)) {
            nicknameHelper.textContent = '*띄어쓰기를 없애주세요';
            nicknameHelper.style.display = 'block';
        } else if (nicknameValue.length > 10) {
            nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다';
            nicknameHelper.style.display = 'block';
        } else {
            nicknameHelper.style.display = 'none';
        }
        updateSignupButtonState();
    }

    function updateSignupButtonState() {
        if (isFormValid()) {
            signupButton.disabled = false;
            signupButton.style.cursor = 'pointer';
        } else {
            signupButton.disabled = true;
            signupButton.style.cursor = 'default';
        }
    }

    function isFormValid() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const nicknameValue = nicknameInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

        return (
            emailValue !== "" &&
            emailValue.length >= 5 &&
            emailRegex.test(emailValue) &&
            passwordValue !== "" &&
            passwordRegex.test(passwordValue) &&
            passwordValue === passwordCheckValue &&
            nicknameValue !== "" &&
            !/\s/.test(nicknameValue) &&
            nicknameValue.length <= 10
        );
    }

    signupButton.addEventListener('click', function (event) {
        event.preventDefault();

        const originalColor = signupButton.style.backgroundColor;
        signupButton.style.backgroundColor = "#7F6AEE";

        setTimeout(() => {
            signupButton.style.backgroundColor = originalColor; // 원래 색상으로 되돌림
            setTimeout(() => {
                /* 사용자 정보 추가 로직 구현 필요 */
                window.location.href = "../login/login.html"; // 페이지 이동
            }, 500); // 0.5초 후 페이지 이동
        }, 500); // 0.5초 동안 색상 유지

    });
});
