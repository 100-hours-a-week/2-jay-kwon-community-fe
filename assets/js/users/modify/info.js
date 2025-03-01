document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../login.html';
        return;
    }

    if (loggedInUser.profile_image) {
        document.getElementById('profileImage').src = loggedInUser.profile_image;
    }

    let oldNickname = loggedInUser.nickname || "";
    document.getElementById('nickname').placeholder = oldNickname;

    const imageContainer = document.querySelector('.profile .image');
    if (imageContainer && loggedInUser.profile_image) {
        imageContainer.style.backgroundImage = `url(${loggedInUser.profile_image})`;
    }
    const fileInput = document.getElementById('profile-img-upload');
    const modifyButton = document.getElementById('modify-button');
    const nicknameInput = document.getElementById('nickname');
    const nicknameHelper = document.querySelector('.helper-text .nickname');
    const withdrawalLink = document.getElementById('withdrawal-link');

    let newProfileImage = null;

    imageContainer.addEventListener('click', () => {
        fileInput.click();
    });
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                imageContainer.style.backgroundImage = `url(${imageData})`;
                newProfileImage = imageData;
            };
            reader.readAsDataURL(file);
        } else {
            imageContainer.style.backgroundImage = `url(${loggedInUser.profile_image})`;
        }
    });

    modifyButton.addEventListener('click', (event) => {
        event.preventDefault();

        let nicknameValue = nicknameInput.value.trim();
        if (nicknameValue === "") {
            nicknameValue = oldNickname;
        }

        const validationResult = validator.validateNickname(nicknameValue);
        if (!validationResult.valid) {
            nicknameHelper.textContent = validationResult.message;
            nicknameHelper.style.display = 'block';
            nicknameHelper.style.color = 'red';
            return;
        }

        if (nicknameValue === oldNickname && !newProfileImage) {
            showToast();
            return;
        }

        const users = usersAPI.getUsers();
        const isDuplicate = users.some(user =>
            user.nickname === nicknameValue && user.mno !== loggedInUser.mno
        );
        if (isDuplicate) {
            nicknameHelper.textContent = '*중복된 닉네임입니다';
            nicknameHelper.style.display = 'block';
            nicknameHelper.style.color = 'red';
        } else {
            nicknameHelper.style.display = 'none';
            loggedInUser.nickname = nicknameValue;
            if (newProfileImage) {
                loggedInUser.profile_image = newProfileImage;
            }
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            usersAPI.updateUser({ mno: loggedInUser.mno, nickname: nicknameValue, profile_image: loggedInUser.profile_image });
            document.getElementById('profileImage').src = loggedInUser.profile_image;
            showToast();
        }
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

    const withdrawalModal = document.createElement('div');
    withdrawalModal.id = 'withdrawal-modal';
    withdrawalModal.className = 'modal';
    withdrawalModal.innerHTML = `
        <div class="modal-content">
            <h3></h3>
            <p></p>
            <button id="cancel-withdrawal" class="button">취소</button>
            <button id="confirm-withdrawal" class="button">확인</button>
        </div>
    `;
    document.body.appendChild(withdrawalModal);

    withdrawalLink.addEventListener('click', (event) => {
        event.preventDefault();
        modalUtil.openModal('withdrawal-modal', {
            title: "회원탈퇴 하시겠습니까?",
            message: "작성된 게시글과 댓글, 좋아요가 모두 삭제됩니다."
        });
    });
    modalUtil.initModal('withdrawal-modal', 'cancel-withdrawal', 'confirm-withdrawal', () => {
        const allUsers = usersAPI.getUsers();
        const updatedUsers = allUsers.filter(user => user.mno !== loggedInUser.mno);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        let posts = postsAPI.getPosts();
        posts = posts.filter(post => post.wno !== loggedInUser.mno);
        localStorage.setItem('posts', JSON.stringify(posts));

        let comments = commentsAPI.getComments();
        comments = comments.filter(comment => comment.mno !== loggedInUser.mno);
        localStorage.setItem('comments', JSON.stringify(comments));

        let hearts = heartsAPI.getHearts();
        hearts = hearts.filter(heart => heart.mno !== loggedInUser.mno);
        localStorage.setItem('hearts', JSON.stringify(hearts));

        localStorage.removeItem('loggedInUser');
        window.location.href = '../login.html';
    });
});
