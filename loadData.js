document.addEventListener('DOMContentLoaded', () => {

    // 기본 이미지 파일을 Base64 인코딩된 데이터 URL로 변환
    async function fetchBase64Image(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // users.json 데이터를 fetch하여 로컬 스토리지에 저장
    const usersPromise = fetch('dummy/data/users.json')
        .then(response => response.json())
        .then(users => {
            return fetchBase64Image('dummy/images/default_profile.png')
                .then(base64data => {
                    users.forEach(user => {
                        if (user.profile.image === 'default_profile.png') {
                            user.profile.image = base64data;
                        }
                    });
                    localStorage.setItem('users', JSON.stringify(users));
                    console.log('Users data saved to localStorage:', users);
                })
                .catch(error => console.error('기본 프로필 이미지 로드 실패:', error));
        })
        .catch(error => console.error('users.json 로드 실패:', error));

    // posts.json 데이터를 fetch하여 로컬 스토리지에 저장
    const postsPromise = fetch('dummy/data/posts.json')
        .then(response => response.json())
        .then(posts => {
            return fetchBase64Image('dummy/images/default_post.png')
                .then(base64data => {
                    posts.forEach(post => {
                        if (post.image === 'default_post.png') {
                            post.image = base64data;
                        }
                    });
                    localStorage.setItem('posts', JSON.stringify(posts));
                    console.log('Posts data saved to localStorage:', posts);
                })
                .catch(error => console.error('기본 게시글 이미지 로드 실패:', error));
        })
        .catch(error => console.error('posts.json 로드 실패:', error));

    // 모든 비동기 작업이 완료된 후 리디렉션 수행
    Promise.all([usersPromise, postsPromise]).finally(() => {
        console.log('Data loading complete, redirecting to login page.');
        window.location.href = 'login/login.html';
    });
});
