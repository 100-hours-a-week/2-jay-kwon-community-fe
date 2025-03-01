document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.profile_image) {
        document.getElementById('profileImage').src = loggedInUser.profile_image;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pnoParam = urlParams.get("pno");
    const pno = pnoParam ? parseInt(pnoParam) : null;
    
    const post = postsAPI.getPost(pno);
    if (!post) {
        alert("게시글 정보를 불러올 수 없습니다.");
        return;
    }

    // 기존 게시글 정보 세팅
    const titleInputEl = document.getElementById("title-input");
    const contentInputEl = document.getElementById("content-input");
    const fileUploadText = document.getElementById("file-upload-text");
    const imageUploadEl = document.getElementById("image-upload");
    const imageUploadButton = document.getElementById("image-upload-button");
    const completeButton = document.getElementById("complete-button");
    const completeCheckHelper = document.querySelector(".helper-text .complete-check");

    titleInputEl.value = post.title;
    contentInputEl.value = post.content;
    if (post.post_image && post.post_image_name) {
        fileUploadText.textContent = post.post_image_name;
    } else {
        fileUploadText.textContent = "파일을 선택해주세요.";
    }

    titleInputEl.addEventListener('input', () => {
        if (titleInputEl.value.length > 26) {
            titleInputEl.value = titleInputEl.value.slice(0, 26);
        }
        toggleCompleteButton();
    });
    contentInputEl.addEventListener('input', toggleCompleteButton);

    completeButton.disabled = true;
    completeButton.style.backgroundColor = '#ACA0EB';
    if (completeCheckHelper) {
        completeCheckHelper.style.display = 'none';
    }
    toggleCompleteButton();

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

    imageUploadButton.addEventListener('click', () => {
        imageUploadEl.click();
    });

    imageUploadEl.addEventListener('change', () => {
        if (imageUploadEl.files && imageUploadEl.files.length > 0) {
            fileUploadText.textContent = imageUploadEl.files[0].name;
        } else {
            fileUploadText.textContent = "파일을 선택해주세요.";
            post.post_image = null;
            post.post_image_name = null;
        }
    });

    completeButton.addEventListener("click", () => {
        const titleInput = titleInputEl.value.trim();
        const contentInput = contentInputEl.value.trim();

        if (!titleInput || !contentInput) {
            if (completeCheckHelper) {
                completeCheckHelper.textContent = '*제목, 내용을 모두 작성해주세요.';
                completeCheckHelper.style.display = 'block';
            }
            return;
        }

        // 게시글 업데이트
        post.title = titleInput;
        post.content = contentInput;
        post.modified_at = new Date().toISOString();

        // 이미지 파일이 선택된 경우 처리
        if (imageUploadEl && imageUploadEl.files && imageUploadEl.files.length > 0) {
            const file = imageUploadEl.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                // 수정된 이미지 데이터와 파일 이름을 저장 (일관되게 post.post_image, post.post_image_name 사용)
                post.post_image = event.target.result;
                post.post_image_name = file.name;
                postsAPI.updatePost(post);
                window.location.href = `./detail.html?pno=${post.pno}`;
            };
            reader.readAsDataURL(file);
        } else {
            // 이미지가 선택되지 않은 경우 기존 이미지 유지
            postsAPI.updatePost(post);
            window.location.href = `./detail.html?pno=${post.pno}`;
        }
    });
});
