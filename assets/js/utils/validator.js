// 이메일 검증 함수
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = re.test(email);
    return {
        valid: valid,
        message: valid ? "" : "*올바른 이메일 주소 형식을 입력해주세요"
    };
}

// 비밀번호 검증 함수
function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const valid = re.test(password);
    return {
        valid: valid,
        message: valid ? "" : "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다"
    };
}

// 닉네임 검증 함수
function validateNickname(nickname) {
    if (!nickname) {
        return {
            valid: false,
            message: "*닉네임을 입력해주세요"
        };
    }
    if (/\s/.test(nickname)) {
        return {
            valid: false,
            message: "*띄어쓰기를 없애주세요"
        };
    }
    if (nickname.length > 10) {
        return {
            valid: false,
            message: "*닉네임은 최대 10자까지 작성 가능합니다"
        };
    }
    return {
        valid: true,
        message: ""
    };
}

// 전역으로 노출
window.validator = {
    validateEmail,
    validatePassword,
    validateNickname
};
