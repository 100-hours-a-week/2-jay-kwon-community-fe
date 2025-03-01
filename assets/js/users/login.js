document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const helperText = document.querySelector(".helper-text .login");
    const loginButton = document.querySelector(".buttons .button");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 이메일 유효성 검사: 값이 없거나 길이가 5 미만인 경우
        if (emailValue === "" || emailValue.length < 5) {
            helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요';
            helperText.style.display = "block";
            helperText.style.color = "red";
            return;
        }

        // validator.js의 이메일 검증 함수 사용
        const isValidEmail = validator.validateEmail(emailValue);
        if (!isValidEmail.valid) {
            helperText.textContent = isValidEmail.message;
            helperText.style.display = "block";
            helperText.style.color = "red";
            return;
        }

        // 비밀번호가 빈 값인 경우
        if (passwordValue === "") {
            helperText.textContent = '*비밀번호를 입력해주세요';
            helperText.style.display = "block";
            helperText.style.color = "red";
            return;
        }

        // validator.js의 비밀번호 검증 함수 사용
        const isValidPassword = validator.validatePassword(passwordValue);
        if (!isValidPassword.valid) {
            helperText.textContent = isValidPassword.message;
            helperText.style.display = "block";
            helperText.style.color = "red";
            return;
        }

        // usersAPI의 getUserByEmail 함수를 사용하여 이메일에 해당하는 사용자를 가져옴
        const user = usersAPI.getUserByEmail(emailValue);
        if (user) {
            // 이메일이 일치하는 사용자가 있으면 비밀번호도 확인
            if (user.password === passwordValue) {
                // 로그인 성공 시 로그인한 회원 정보를 loggedInUser에 저장
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                helperText.style.display = "none";
                const originalColor = loginButton.style.backgroundColor;
                loginButton.style.backgroundColor = "#7F6AEE";
                setTimeout(() => {
                    loginButton.style.backgroundColor = originalColor;
                    setTimeout(() => {
                        // 로그인 성공 후 상위 폴더(예: 홈페이지)로 이동
                        window.location.href = "../posts/list.html";
                    }, 500);
                }, 500);
            } else {
                helperText.textContent = '*아이디 또는 비밀번호를 확인해주세요';
                helperText.style.display = "block";
                helperText.style.color = "red";
            }
        } else {
            helperText.textContent = '*아이디 또는 비밀번호를 확인해주세요';
            helperText.style.display = "block";
            helperText.style.color = "red";
        }
    });
});
