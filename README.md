### Say Anything Party
아무 말 대잔치 커뮤니티

### 연관 프로젝트
Backend API Server: [sap-api-server](https://github.com/juintination/sap-api-server)

### 사용 방법
1. Git clone repository

```
git clone https://github.com/juintination/say-anything-party.git

cd say-anything-party
```

2. Install modules

```
npm install
```

3. Run application

```
npm start
```

### 리액트 마이그레이션 이전 프로젝트 링크
https://github.com/juintination/say-anything-party/tree/pre-refactor/react-migration

### 실행 영상
https://youtu.be/AzLmAwt_Dv4

### 실행 화면
|로그인|회원가입|
|---|---|
|![login](https://github.com/user-attachments/assets/e56da7a9-52c4-47c0-870d-e9da4a1979e6)|![signup](https://github.com/user-attachments/assets/31e26b05-ddf1-4c86-9954-bb396b5890c2)|

|전체 게시글|게시글 상세|게시글 수정|
|---|---|---|
|![post-list](https://github.com/user-attachments/assets/fbcf7018-bdba-4c80-9113-d248b6304439)|![post-detail](https://github.com/user-attachments/assets/c13a13b0-1c04-4225-a18c-c9817449e353)|![post-edit](https://github.com/user-attachments/assets/a12c6e10-b433-4310-aa79-d87c71a6b947)|

|게시글 삭제 모달|댓글 삭제 모달|
|---|---|
|![post-delete](https://github.com/user-attachments/assets/74b0bab6-6a12-4109-a82a-50923e6cf763)|![comment-delete](https://github.com/user-attachments/assets/cc048fbf-6594-4f45-a343-e7c2301e5dac)|

|드롭다운|비밀번호 변경|
|---|---|
|![dropdown](https://github.com/user-attachments/assets/d326f4b8-ef25-4da5-a36e-1ea8e37ca556)|![change-password](https://github.com/user-attachments/assets/c179eb2e-33e3-4b8c-904a-b4f158ea1ace)|

|회원정보 수정|회원 탈퇴 모달|
|---|---|
|![edit-profile](https://github.com/user-attachments/assets/ae2ac4d4-7630-41fc-b3f8-26f0dd4b2693)|![member-withdrawal](https://github.com/user-attachments/assets/763deef4-d097-4a83-b3df-d12c32e5e5d1)|

### 회고
- 기존 [바닐라 JS로 만들었던 프로젝트](https://github.com/juintination/say-anything-party/tree/pre-refactor/react-migration)는 Api를 따로 분리하는 등 이번 과제를 원활하게 진행하기 위한 작업을 진행했지만, 백엔드 API 서버와의 설계 내용과 약간의 차이가 있었습니다.
    - 예를 들어 기존 usersApi는 CRUD 관련 Api만 지원했기 때문에 이메일 및 닉네임 중복 여부 확인, 비밀번호 검사 로직 등을 위한 추가적인 작업이 필요했습니다.
        - 추후에 리액트 마이그레이션을 진행하기로 다짐했었는데, 어차피 추가적인 작업이 필요하다면 이참에 진행해야겠다 싶어서 기존 프로젝트에서 백엔드 API 서버와의 연동을 진행하지 않고 바로 리액트 프로젝트를 시작하였습니다.
- 기능 추가는 지양하라고 하셨지만, 피그마 요구사항을 처음 봤을 때부터 추가하고 싶던 기능이 있었기 때문에 최대한 디자인을 해치지 않는 선에서 이를 구현하였습니다.
    - 이메일을 변경할 수 있도록 하였습니다.
    - 비밀번호를 변경할 때 기존 비밀번호의 일치 여부를 확인할 수 있도록 하였습니다.
- TailwindCss 적용
    - 지금까지 CSS 파일 작성에 어려움이 많았었기 때문에 비교적 쉽게 적용하고, 바로 확인할 수 있는 tailwindcss를 적용하였습니다.
        - `$ npm install -D tailwindcss` 명령어로 최신 버전의 tailwind를 설치하려고 했으나, init 관련 명령어에서 에러가 발생했습니다.
        - 최신 버전부터는 해당 명령어를 지원하지 않았고, 직접 config 파일을 작성해야 했는데, 동일하게 config 파일을 작성하더라도 다른 에러가 발생해서 구버전인 3.4.6 버전을 package.json에 명시한 후 package-lock.json 및 node_modules 폴더를 삭제한 후 `$ npm install` 명령어를 통해 적용하였습니다.
- BasicLayout 적용 및 컴포넌트 분리
    - 레이아웃을 분리함으로써 기존에 모든 html 코드에 들어갔던 상단에 있는 메뉴에 관한 코드를 하나(BasicMenu)로 줄여서 기본 레이아웃(BasicLayout)에 적용시켜서 재사용할 수 있었습니다.
    - 또한 자주 사용되는 모달(BasicModal), 토스트(BasicToast) 등의 유틸도 별도의 컴포넌트로 분리하여 코드의 재사용성을 높일 수 있었습니다.
- Redux를 활용한 상태 관리
    - /slices/loginSlice.js 파일에서 Redux Slice를 정의했습니다.
    - store.js 파일에서 Redux Store를 정의했습니다.
    - /hooks/useCustomLogin.js 파일에서 Redux 상태와 액션을 사용하는 커스텀 훅을 정의했습니다.
- 쿠키 관리
    - 쿠키 관리는 util/cookieUtil.js 파일을 통해 진행됩니다. react-cookie 라이브러리를 사용한 setCookie, getCookie, removeCookie 함수를 정의합니다.
    - 또한 loginSlice.js 파일에서 로그인 상태를 관리하기 위해 쿠키를 설정하고 삭제합니다.
