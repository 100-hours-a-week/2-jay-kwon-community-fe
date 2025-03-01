### 3, 4주차 과제 내용

HTML, CSS, Vanila JS로 피그마의 기능 정의서와 화면 설계서를 보고 아무 말 대잔치 커뮤니티 제작하기

### 사용 방법
- 프로젝트 다운로드
  - 이 저장소를 ZIP으로 다운로드하거나 클론(clone)합니다.
- Visual Studio Code에서 폴더 열기
  - VSCode를 실행한 뒤, “폴더 열기”를 통해 프로젝트 폴더를 엽니다.
- Live Server 확장 설치
  - VSCode 확장(Extensions) 탭에서 “Live Server”를 검색하여 설치합니다.
- index.html 실행
  - 프로젝트 내 index.html 파일을 마우스 오른쪽 버튼으로 클릭한 뒤, “Open with Live Server” 메뉴를 선택하여 실행합니다.
- 더미 데이터 로드 확인
  - 브라우저 콘솔에서 에러 없이 JSON 데이터가 로컬 스토리지에 저장되는지 확인합니다.
    
### 리펙터링 이후 프로젝트 구조
    
```
│  index.html
│  
├─assets
│  ├─css
│  │  ├─common
│  │  │      common.css
│  │  │
│  │  ├─posts
│  │  │      detail.css
│  │  │      list.css
│  │  │      modify.css
│  │  │      write.css
│  │  │
│  │  └─users
│  │      │  login.css
│  │      │  signup.css
│  │      │
│  │      └─modify
│  │              info.css
│  │              password.css
│  │
│  ├─images
│  │      default_post.png
│  │      default_profile.png
│  │
│  └─js
│      ├─apis
│      │      commentsAPI.js
│      │      heartsAPI.js
│      │      postsAPI.js
│      │      usersAPI.js
│      │
│      ├─common
│      │      common.js
│      │
│      ├─posts
│      │      detail.js
│      │      list.js
│      │      modify.js
│      │      write.js
│      │
│      ├─users
│      │  │  login.js
│      │  │  signup.js
│      │  │
│      │  └─modify
│      │          info.js
│      │          password.js
│      │
│      └─utils
│              formatter.js
│              modalUtil.js
│              validator.js
│
├─dummy
│      data.json
│
└─pages
    ├─posts
    │      detail.html
    │      list.html
    │      modify.html
    │      write.html
    │
    └─users
        │  login.html
        │  signup.html
        │
        └─modify
                info.html
                password.html
```

### 리펙터링 이전 프로젝트 구조

https://github.com/juintination/say-anything-party/tree/pre-refactor/project-structure

```
│  index.html
│  loadData.js
│
├─dummy
│  ├─data
│  │      posts.json
│  │      users.json
│  │
│  └─images
│          default_post.png
│          default_profile.png
│
├─login
│      login.css
│      login.html
│      login.js
│
├─member
│  └─modify
│      ├─info
│      │      info.css
│      │      info.html
│      │      info.js
│      │
│      └─password
│              password.css
│              password.html
│              password.js
│
├─posts
│  ├─detail
│  │      detail.css
│  │      detail.html
│  │      detail.js
│  │
│  ├─list
│  │      list.css
│  │      list.html
│  │      list.js
│  │
│  ├─modify
│  │      modify.css
│  │      modify.html
│  │      modify.js
│  │
│  └─write
│          write.css
│          write.html
│          write.js
│
└─signup
        signup.css
        signup.html
        signup.js
```
