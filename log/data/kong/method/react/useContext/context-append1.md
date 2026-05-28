# Context 외전1

여느때와 같이 context 공부를 마친 나... 더 공부해볼수 밖에 없는 채팅을 받아버리는데...

(대충 놀랍고 엄청나다는 이미지2)

## 서론

헷갈리는 context 공부를 마치고 다른 프론트 개발자분들께 내가 이해한 내용이 맞는지 여쭤보고 있었다.
그런데 하나의 채팅을 받았다.

> 정말 중요한 부분이라서 어려울 만하다 생각해요
> 왜냐면 컴포넌트와 리액트 디렉토리 구조 철학이나 react 관련 라이브러리들의 전역 관리 디자인 패턴 등등 연관이 되어 있어서 말이죠

ㅇㅖ?? **컴포넌트와 리액트 디렉토리 구조 철학이나 react 관련 라이브러리들의 전역 관리 디자인 패턴 등등 연관이 되어 있어서** 홀리몰리
이건 100% 더 공부하면 나한테 도움이 되겠다 싶어서 바로 작성하게 되었다.

## 디렉토리 구조와 Context의 연결

```text
src/
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx      ← auth 트리 전용
│   │   ├── useAuth.ts
│   │   └── components/
│   ├── cart/
│   │   ├── CartContext.tsx      ← cart 트리 전용
│   │   └── components/
└── store/
    └── useUserStore.ts          ← 진짜 전역
```

Context가 곧 feature의 경계선. 디렉터리 구조가 Contetxt 범위를 반영...
