document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile_image) {
        document.getElementById('profileImage').src = loggedInUser.profile_image;
    }

    const titleInputEl = document.getElementById('title-input');
    const contentInputEl = document.getElementById('content-input');
    const fileUploadText = document.getElementById('file-upload-text');
    const imageUploadEl = document.getElementById('image-upload');
    const imageUploadButton = document.getElementById('image-upload-button');
    const completeButton = document.getElementById('complete-button');
    const completeCheckHelper = document.querySelector('.helper-text .complete-check');

    // 초기 버튼 상태 설정
    completeButton.disabled = true;
    completeButton.style.backgroundColor = '#ACA0EB';
    if (completeCheckHelper) {
        completeCheckHelper.style.display = 'none';
    }

    titleInputEl.addEventListener('input', () => {
        if (titleInputEl.value.length > 26) {
            titleInputEl.value = titleInputEl.value.slice(0, 26);
        }
        toggleCompleteButton();
    });
    contentInputEl.addEventListener('input', toggleCompleteButton);

    function toggleCompleteButton() {
        const title = titleInputEl.value.trim();
        const content = contentInputEl.value.trim();
        if (title && content) {
            completeButton.disabled = false;
            completeButton.style.cursor = 'pointer';
            completeButton.style.backgroundColor = '#7F6AEE';
            if (completeCheckHelper) completeCheckHelper.style.display = 'none';
        } else {
            completeButton.disabled = true;
            completeButton.style.cursor = 'default';
            completeButton.style.backgroundColor = '#ACA0EB';
        }
    }
    toggleCompleteButton();

    imageUploadButton.addEventListener('click', () => {
        imageUploadEl.click();
    });

    imageUploadEl.addEventListener('change', () => {
        if (imageUploadEl.files && imageUploadEl.files.length > 0) {
            fileUploadText.textContent = imageUploadEl.files[0].name;
        } else {
            fileUploadText.textContent = "파일을 선택해주세요.";
        }
    });

    completeButton.addEventListener('click', () => {
        const titleInput = titleInputEl.value.trim();
        const contentInput = contentInputEl.value.trim();

        if (!titleInput || !contentInput) {
            if (completeCheckHelper) {
                completeCheckHelper.textContent = '*제목, 내용을 모두 작성해주세요.';
                completeCheckHelper.style.display = 'block';
                completeCheckHelper.style.color = 'red';
            }
            return;
        }

        // 새 게시글 생성
        const newPost = {
            title: titleInput,
            content: contentInput,
            wno: loggedInUser ? loggedInUser.mno : null
        };

        // 이미지 파일 선택 여부 체크하여 처리
        if (imageUploadEl && imageUploadEl.files && imageUploadEl.files.length > 0) {
            const file = imageUploadEl.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                newPost.post_image = event.target.result;
                newPost.post_imageName = file.name;
                postsAPI.createPost(newPost);
                window.location.href = './list.html';
            };
            reader.readAsDataURL(file);
        } else {
            newPost.post_image = null;
            newPost.post_imageName = null;
            postsAPI.createPost(newPost);
            window.location.href = './list.html';
        }
    });
});
