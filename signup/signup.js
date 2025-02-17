document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const nicknameInput = document.getElementById('nickname');
    const signupButton = document.getElementById('signup-button');
    const imageContainer = document.querySelector('.profile .image');
    const fileInput = document.getElementById('profile-img-upload');

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
            updateSignupButtonState();
        } else if (emailValue.length < 5 || !emailRegex.test(emailValue)) {
            emailHelper.textContent = '*올바른 이메일 주소 형식을 입력해주세요';
            emailHelper.style.display = 'block';
            updateSignupButtonState();
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const isDuplicate = users.some(user => user.email === emailValue);
            if (isDuplicate) {
                emailHelper.textContent = '*중복된 이메일입니다';
                emailHelper.style.display = 'block';
            } else {
                emailHelper.style.display = 'none';
            }
            updateSignupButtonState();
        }
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
            // 닉네임 중복 확인 로직 추가
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const isDuplicate = users.some(user => user.profile && user.profile.nickname === nicknameValue);
            if (isDuplicate) {
                nicknameHelper.textContent = '*중복된 닉네임입니다';
                nicknameHelper.style.display = 'block';
            } else {
                nicknameHelper.style.display = 'none';
            }
        }
        updateSignupButtonState();
    }

    imageContainer.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
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

    function updateSignupButtonState() {
        const profileHelper = document.querySelector('.helper-text .profile');
        if (!imageContainer.classList.contains('uploaded')) {
            profileHelper.textContent = '*프로필 사진을 추가해주세요';
            profileHelper.style.display = 'block';
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
            nicknameValue.length <= 10 &&
            imageContainer.classList.contains('uploaded')
        );
    }

    signupButton.addEventListener('click', function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const nicknameValue = nicknameInput.value.trim();
        const profileImage = imageContainer.style.backgroundImage.slice(5, -2);

        const newUser = {
            id: Date.now(), // 고유 ID 생성
            profile: {
                nickname: nicknameValue,
                image: profileImage
            },
            email: emailValue,
            password: passwordValue
        };

        // 로컬 스토리지에서 users 데이터를 가져옴
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const originalColor = signupButton.style.backgroundColor;
        signupButton.style.backgroundColor = "#7F6AEE";

        setTimeout(() => {
            signupButton.style.backgroundColor = originalColor; // 원래 색상으로 되돌림
            setTimeout(() => {
                window.location.href = "../login/login.html"; // 페이지 이동
            }, 500); // 0.5초 후 페이지 이동
        }, 500); // 0.5초 동안 색상 유지
    });
});
