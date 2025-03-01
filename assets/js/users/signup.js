document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const nicknameInput = document.getElementById('nickname');
    const signupButton = document.getElementById('signup-button');
    const imageContainer = document.querySelector('.profile .image');
    const fileInput = document.getElementById('profile-img-upload');

    // 각 입력 필드에 대한 blur 이벤트로 검증 실행
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    passwordCheckInput.addEventListener('blur', validatePasswordCheck);
    nicknameInput.addEventListener('blur', validateNickname);

    // 초기 상태 설정
    updateSignupButtonState();

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailHelper = document.querySelector('.helper-text .email');
        const result = validator.validateEmail(emailValue);

        if (emailValue === "") {
            emailHelper.textContent = '*이메일을 입력해주세요';
            emailHelper.style.display = 'block';
            emailHelper.style.color = 'red';
        } else if (!result.valid) {
            emailHelper.textContent = result.message;
            emailHelper.style.display = 'block';
            emailHelper.style.color = 'red';
        } else {
            // 중복 이메일 검사: usersAPI의 getUserByEmail 사용
            const existingUser = usersAPI.getUserByEmail(emailValue);
            if (existingUser) {
                emailHelper.textContent = '*중복된 이메일입니다';
                emailHelper.style.display = 'block';
                emailHelper.style.color = 'red';
            } else {
                emailHelper.style.display = 'none';
            }
        }
        updateSignupButtonState();
    }

    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        const passwordHelper = document.querySelector('.helper-text .password');
        const result = validator.validatePassword(passwordValue);

        if (!passwordValue) {
            passwordHelper.textContent = '*비밀번호를 입력해주세요';
            passwordHelper.style.display = 'block';
            passwordHelper.style.color = 'red';
        } else if (!result.valid) {
            passwordHelper.textContent = result.message;
            passwordHelper.style.display = 'block';
            passwordHelper.style.color = 'red';
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
            passwordCheckHelper.style.color = 'red';
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
            passwordCheckHelper.style.display = 'block';
            passwordCheckHelper.style.color = 'red';
        } else {
            passwordCheckHelper.style.display = 'none';
        }
        updateSignupButtonState();
    }

    function validateNickname() {
        const nicknameValue = nicknameInput.value.trim();
        const nicknameHelper = document.querySelector('.helper-text .nickname');
        const result = validator.validateNickname(nicknameValue);

        if (!result.valid) {
            nicknameHelper.textContent = result.message;
            nicknameHelper.style.display = 'block';
            nicknameHelper.style.color = 'red';
        } else {
            // 추가로 로컬 스토리지의 데이터를 통해 중복 검사
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const isDuplicate = users.some(user => user.nickname === nicknameValue);
            if (isDuplicate) {
                nicknameHelper.textContent = '*중복된 닉네임입니다';
                nicknameHelper.style.display = 'block';
                nicknameHelper.style.color = 'red';
            } else {
                nicknameHelper.style.display = 'none';
            }
        }
        updateSignupButtonState();
    }

    // 프로필 이미지 업로드 이벤트 처리
    imageContainer.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageContainer.style.backgroundImage = `url(${e.target.result})`;
                imageContainer.style.backgroundSize = 'cover';
                imageContainer.style.backgroundPosition = 'center';
                imageContainer.style.backgroundColor = 'transparent';
                imageContainer.classList.add('uploaded');
                updateSignupButtonState();
            };
            reader.readAsDataURL(file);
        } else {
            imageContainer.style.backgroundImage = '';
            imageContainer.style.backgroundColor = '#C4C4C4';
            imageContainer.classList.remove('uploaded');
            updateSignupButtonState();
        }
    });

    // 회원가입 버튼 활성화 상태 갱신
    function updateSignupButtonState() {
        const profileHelper = document.querySelector('.helper-text .profile');
        if (!imageContainer.classList.contains('uploaded')) {
            profileHelper.textContent = '*프로필 사진을 추가해주세요';
            profileHelper.style.display = 'block';
            profileHelper.style.color = 'red';
        } else {
            profileHelper.style.display = 'none';
        }

        if (isFormValid()) {
            signupButton.disabled = false;
            signupButton.style.cursor = 'pointer';
            signupButton.style.backgroundColor = '#7F6AEE';
        } else {
            signupButton.disabled = true;
            signupButton.style.cursor = 'default';
            signupButton.style.backgroundColor = '#ACA0EB';
        }
    }

    // 전체 입력값의 유효성 검사 (각 조건을 별도 변수에 할당)
    function isFormValid() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const nicknameValue = nicknameInput.value.trim();

        // 이메일: 5자 이상, 유효한 형식, 중복되지 않음
        const emailValid =
            emailValue.length >= 5 &&
            validator.validateEmail(emailValue).valid &&
            !usersAPI.getUserByEmail(emailValue);

        // 비밀번호: 비어있지 않고 유효한 형식
        const passwordValid =
            passwordValue !== "" &&
            validator.validatePassword(passwordValue).valid;

        // 비밀번호 확인: 동일해야 함
        const passwordsMatch = passwordValue === passwordCheckValue;

        // 닉네임: 빈 값 아님, 띄어쓰기 없음, 최대 10자, 중복되지 않음
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const nicknameValid =
            nicknameValue !== "" &&
            !/\s/.test(nicknameValue) &&
            nicknameValue.length <= 10 &&
            !users.some(user => user.nickname === nicknameValue);

        // 프로필 이미지 업로드 여부
        const profileUploaded = imageContainer.classList.contains('uploaded');

        return emailValid && passwordValid && passwordsMatch && nicknameValid && profileUploaded;
    }

    // 회원가입 버튼 클릭 시, usersAPI를 사용하여 새 회원 생성 (더미 데이터 형식 유지)
    signupButton.addEventListener('click', function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const nicknameValue = nicknameInput.value.trim();

        // "url("data:image/png;base64,...")" 에서 실제 데이터만 추출
        const bgImage = imageContainer.style.backgroundImage;
        const profileImage = bgImage.slice(5, bgImage.length - 2);

        // 더미 데이터 형식: { mno, email, password, nickname, profile_image, created_at }
        const newUser = {
            email: emailValue,
            password: passwordValue,
            nickname: nicknameValue,
            profile_image: profileImage
        };

        // usersAPI.createUser 내부에서 mno와 created_at을 추가하도록 설계
        const createdUser = usersAPI.createUser(newUser);
        if (createdUser) {
            const originalColor = signupButton.style.backgroundColor;
            signupButton.style.backgroundColor = "#7F6AEE";
            setTimeout(() => {
                signupButton.style.backgroundColor = originalColor;
                setTimeout(() => {
                    window.location.href = "./login.html";
                }, 500);
            }, 500);
        } else {
            const emailHelper = document.querySelector('.helper-text .email');
            emailHelper.textContent = '*회원가입에 실패했습니다. 다시 시도해주세요.';
            emailHelper.style.display = 'block';
            emailHelper.style.color = 'red';
        }
    });
});
