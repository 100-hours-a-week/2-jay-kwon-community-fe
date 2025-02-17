document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const helperText = document.querySelector(".helper-text .login");
    const loginButton = document.querySelector(".buttons .button");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (emailValue === "" || emailValue.length < 5 || !validateEmail(emailValue)) {
            helperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요";
            helperText.style.display = "block";
        } else if (passwordValue === "") {
            helperText.textContent = "*비밀번호를 입력해주세요";
            helperText.style.display = "block";
        } else if (!validatePassword(passwordValue)) {
            helperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다";
            helperText.style.display = "block";
        } else {
            // 로컬 스토리지에서 users 데이터를 가져옴
            const users = JSON.parse(localStorage.getItem('users'));
            if (users) {
                const user = users.find(user => user.email === emailValue && user.password === passwordValue);
                if (user) {
                    // 로그인 성공 시 사용자 정보를 로컬 스토리지에 저장
                    localStorage.setItem('loggedInUser', JSON.stringify(user));

                    helperText.style.display = "none";
                    const originalColor = loginButton.style.backgroundColor;
                    loginButton.style.backgroundColor = "#7F6AEE";
                    setTimeout(() => {
                        loginButton.style.backgroundColor = originalColor; // 원래 색상으로 되돌림
                        setTimeout(() => {
                            window.location.href = "../posts/list/list.html"; // 페이지 이동
                        }, 500); // 0.5초 후 페이지 이동
                    }, 500); // 0.5초 동안 색상 유지
                } else {
                    helperText.textContent = "*아이디 또는 비밀번호를 확인해주세요";
                    helperText.style.display = "block";
                }
            } else {
                helperText.textContent = "*사용자 데이터를 로드할 수 없습니다. 다시 시도해주세요.";
                helperText.style.display = "block";
            }
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }
});
