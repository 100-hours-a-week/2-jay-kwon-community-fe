document.addEventListener('DOMContentLoaded', () => {
    const modifyButton = document.getElementById('modify-button');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const passwordHelper = document.querySelector('.helper-text .password');
    const passwordCheckHelper = document.querySelector('.helper-text .password-check');
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

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

    modifyButton.addEventListener('click', function(event) {
        event.preventDefault();

        const originalColor = modifyButton.style.backgroundColor;
        modifyButton.style.backgroundColor = "#7F6AEE";

        setTimeout(() => {
            modifyButton.style.backgroundColor = originalColor; // 원래 색상으로 되돌림
            setTimeout(() => {
                showToast();
            }, 500); // 0.5초 후 페이지 이동
        }, 500); // 0.5초 동안 색상 유지
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
