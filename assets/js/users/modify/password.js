document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../login.html';
        return;
    }

    if (loggedInUser.profile_image) {
        document.getElementById('profileImage').src = loggedInUser.profile_image;
    }

    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const passwordHelper = document.querySelector('.helper-text .password');
    const passwordCheckHelper = document.querySelector('.helper-text .password-check');
    const modifyButton = document.getElementById('modify-button');

    passwordInput.addEventListener('blur', validatePasswordInput);
    passwordCheckInput.addEventListener('blur', validatePasswordCheckInput);
    updateModifyButtonState();

    function validatePasswordInput() {
        const passwordValue = passwordInput.value.trim();
        const result = validator.validatePassword(passwordValue);
        if (!result.valid) {
            passwordHelper.textContent = result.message;
            passwordHelper.style.display = 'block';
            passwordHelper.style.color = 'red';
        } else {
            passwordHelper.style.display = 'none';
        }
        updateModifyButtonState();
    }

    function validatePasswordCheckInput() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const result = validator.validatePasswordCheck(passwordValue, passwordCheckValue);
        if (!result.valid) {
            passwordCheckHelper.textContent = result.message;
            passwordCheckHelper.style.display = 'block';
            passwordCheckHelper.style.color = 'red';
        } else {
            passwordCheckHelper.style.display = 'none';
        }
        updateModifyButtonState();
    }

    function updateModifyButtonState() {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordCheckInput.value.trim();
        const passwordResult = validator.validatePassword(passwordValue);
        const passwordCheckResult = validator.validatePasswordCheck(passwordValue, passwordCheckValue);

        if (passwordValue && passwordResult.valid && passwordCheckResult.valid) {
            modifyButton.disabled = false;
            modifyButton.style.cursor = 'pointer';
        } else {
            modifyButton.disabled = true;
            modifyButton.style.cursor = 'default';
        }
    }

    modifyButton.addEventListener('click', (event) => {
        event.preventDefault();
        const newPassword = passwordInput.value.trim();
        loggedInUser.password = newPassword;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        usersAPI.updateUser({ mno: loggedInUser.mno, password: newPassword });
        showToast();
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
