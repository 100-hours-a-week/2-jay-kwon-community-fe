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

    // 각 필드의 검증 상태를 저장하는 객체
    const validationState = {
        email: false,
        password: false,
        passwordCheck: false,
        nickname: false,
        profile: false
    };

    // 초기 상태 설정
    updateSignupButtonState();

    // 이메일 검증
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailHelper = document.querySelector('.helper-text .email');
        const result = validator.validateEmail(emailValue);

        if (emailValue === "") {
            emailHelper.textContent = '*이메일을 입력해주세요';
            emailHelper.style.display = 'block';
            emailHelper.style.color = 'red';
            validationState.email = false;
        } else if (!result.valid) {
            emailHelper.textContent = result.message;
            emailHelper.style.display = 'block';
            emailHelper.style.color = 'red';
            validationState.email = false;
        } else {
            if (usersAPI.getUserByEmail(emailValue)) {
                emailHelper.textContent = '*중복된 이메일입니다';
                emailHelper.style.display = 'block';
                emailHelper.style.color = 'red';
                validationState.email = false;
            } else {
                emailHelper.style.display = 'none';
                validationState.email = true;
            }
        }
        updateSignupButtonState();
    }

    // 비밀번호 검증
    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        const passwordHelper = document.querySelector('.helper-text .password');
        const result = validator.validatePassword(passwordValue);

        if (!passwordValue) {
            passwordHelper.textContent = '*비밀번호를 입력해주세요';
            passwordHelper.style.display = 'block';
            passwordHelper.style.color = 'red';
            validationState.password = false;
        } else if (!result.valid) {
            passwordHelper.textContent = result.message;
            passwordHelper.style.display = 'block';
            passwordHelper.style.color = 'red';
            validationState.password = false;
        } else {
            passwordHelper.style.display = 'none';
            validationState.password = true;
        }
        updateSignupButtonState();
    }

    // 비밀번호 확인 검증
    function validatePasswordCheck() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const passwordCheckHelper = document.querySelector('.helper-text .password-check');

        if (!passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호를 한 번 더 입력해주세요';
            passwordCheckHelper.style.display = 'block';
            passwordCheckHelper.style.color = 'red';
            validationState.passwordCheck = false;
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
            passwordCheckHelper.style.display = 'block';
            passwordCheckHelper.style.color = 'red';
            validationState.passwordCheck = false;
        } else {
            passwordCheckHelper.style.display = 'none';
            validationState.passwordCheck = true;
        }
        updateSignupButtonState();
    }

    // 닉네임 검증
    function validateNickname() {
        const nicknameValue = nicknameInput.value.trim();
        const nicknameHelper = document.querySelector('.helper-text .nickname');
        const result = validator.validateNickname(nicknameValue);

        if (!result.valid) {
            nicknameHelper.textContent = result.message;
            nicknameHelper.style.display = 'block';
            nicknameHelper.style.color = 'red';
            validationState.nickname = false;
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.nickname === nicknameValue)) {
                nicknameHelper.textContent = '*중복된 닉네임입니다';
                nicknameHelper.style.display = 'block';
                nicknameHelper.style.color = 'red';
                validationState.nickname = false;
            } else {
                nicknameHelper.style.display = 'none';
                validationState.nickname = true;
            }
        }
        updateSignupButtonState();
    }

    // 프로필 이미지 검증
    function validateProfile() {
        const profileHelper = document.querySelector('.helper-text .profile');
        if (!imageContainer.classList.contains('uploaded')) {
            profileHelper.textContent = '*프로필 사진을 추가해주세요';
            profileHelper.style.display = 'block';
            profileHelper.style.color = 'red';
            validationState.profile = false;
        } else {
            profileHelper.style.display = 'none';
            validationState.profile = true;
        }
    }

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
                validateProfile();
                updateSignupButtonState();
            };
            reader.readAsDataURL(file);
        } else {
            imageContainer.style.backgroundImage = '';
            imageContainer.style.backgroundColor = '#C4C4C4';
            imageContainer.classList.remove('uploaded');
            validateProfile();
            updateSignupButtonState();
        }
    });

    // 회원가입 버튼 활성화 상태 갱신 (전체 검증 상태를 validationState로 확인)
    function updateSignupButtonState() {
        // 프로필 상태를 항상 최신으로 업데이트
        validateProfile();
        const isValid = Object.values(validationState).every(value => value === true);
        if (isValid) {
            signupButton.disabled = false;
            signupButton.style.cursor = 'pointer';
            signupButton.style.backgroundColor = '#7F6AEE';
        } else {
            signupButton.disabled = true;
            signupButton.style.cursor = 'default';
            signupButton.style.backgroundColor = '#ACA0EB';
        }
    }

    // isFormValid 함수를 제거하고, 클릭 시 validationState를 직접 확인
    signupButton.addEventListener('click', function (event) {
        event.preventDefault();
        // 모든 검증 결과가 true인지 inline으로 확인
        if (!Object.values(validationState).every(value => value === true)) {
            return;
        }
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const nicknameValue = nicknameInput.value.trim();

        // 프로필 이미지의 실제 데이터 추출
        const bgImage = imageContainer.style.backgroundImage;
        const profileImage = bgImage.slice(5, bgImage.length - 2);

        const newUser = {
            email: emailValue,
            password: passwordValue,
            nickname: nicknameValue,
            profile_image: profileImage
        };

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
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    });

    // 초기 상태 설정
    validateProfile();
    updateSignupButtonState();
});
