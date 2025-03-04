// 이메일 검증 함수
function validateEmail(email) {
    if (!email) {
        return { valid: false, message: "*이메일을 입력해주세요" };
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return { valid: false, message: "*올바른 이메일 주소 형식을 입력해주세요" };
    }
    return { valid: true, message: "" };
}

// 비밀번호 검증 함수
function validatePassword(password) {
    if (!password) {
        return { valid: false, message: "*비밀번호를 입력해주세요" };
    }
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const valid = re.test(password);
    return {
        valid: valid,
        message: valid ? "" : "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다"
    };
}

// 비밀번호 확인 검증 함수
function validatePasswordCheck(password, passwordCheck) {
    if (!passwordCheck) {
        return { valid: false, message: "*비밀번호를 한 번 더 입력해주세요" };
    }
    if (password !== passwordCheck) {
        return { valid: false, message: "*비밀번호가 다릅니다" };
    }
    return { valid: true, message: "" };
}

// 닉네임 검증 함수
function validateNickname(nickname) {
    if (!nickname) {
        return { valid: false, message: "*닉네임을 입력해주세요" };
    }
    if (/\s/.test(nickname)) {
        return { valid: false, message: "*띄어쓰기를 없애주세요" };
    }
    if (nickname.length > 10) {
        return { valid: false, message: "*닉네임은 최대 10자까지 작성 가능합니다" };
    }
    // 로컬 스토리지에 저장된 사용자 데이터를 통한 중복 검사
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.nickname === nickname)) {
        return { valid: false, message: "*중복된 닉네임입니다" };
    }
    return { valid: true, message: "" };
}

// 프로필 이미지 검증 함수 (업로드 여부 확인)
function validateProfile(isUploaded) {
    if (!isUploaded) {
        return { valid: false, message: "*프로필 사진을 추가해주세요" };
    }
    return { valid: true, message: "" };
}

// 전역으로 노출
window.validator = {
    validateEmail,
    validatePassword,
    validatePasswordCheck,
    validateNickname,
    validateProfile
};
