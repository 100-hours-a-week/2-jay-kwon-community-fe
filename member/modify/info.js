document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.profile .image');
    const fileInput = document.getElementById('profile-img-upload');
    const modifyButton = document.getElementById('modify-button');
    const nicknameInput = document.getElementById('nickname');
    const nicknameHelper = document.querySelector('.helper-text .nickname');

    let oldNickname = "";

    fetch("../../dummy/users.json")
        .then(response => response.json())
        .then(data => {
            const user = data.find(user => user.email === "sample@example.com");
            if (user && user.profile && user.profile.nickname) {
                oldNickname = user.profile.nickname;
                nicknameInput.placeholder = oldNickname;
            }
        })
        .catch(error => {
            console.error("회원 정보 불러오기 에러:", error);
        });

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
            };
            reader.readAsDataURL(file);
        } else {
            imageContainer.style.backgroundImage = `url("../../dummy/images/default.png")`;
            imageContainer.style.backgroundColor = '#C4C4C4';
        }
    });

    modifyButton.addEventListener('click', function(event) {
        event.preventDefault();

        let nicknameValue = nicknameInput.value.trim();

        // 입력 칸이 비어 있으면 기존 닉네임으로 대체
        if (nicknameValue === "") {
            nicknameValue = oldNickname;
        }

        // 닉네임이 10자 초과일 경우
        if (nicknameValue.length > 10) {
            nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다';
            nicknameHelper.style.display = 'block';
            return;
        }

        // 입력된 닉네임이 기존 닉네임과 같다면 별도 중복 체크 없이 통과
        if (nicknameValue === oldNickname) {
            showToast();
            return;
        }

        // 그 외에만 중복 닉네임 검사
        fetch("../../dummy/users.json")
            .then(response => response.json())
            .then(data => {
                const isDuplicate = data.some(
                    user => user.profile && user.profile.nickname === nicknameValue
                );
                if (isDuplicate) {
                    nicknameHelper.textContent = '*중복된 닉네임입니다';
                    nicknameHelper.style.display = 'block';
                } else {
                    nicknameHelper.style.display = 'none';
                    showToast();
                }
            })
            .catch(error => {
                console.error("닉네임 중복 검사 에러:", error);
            });
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
