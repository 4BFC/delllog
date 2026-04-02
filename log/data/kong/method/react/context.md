# 콘-텍스트

> [!Info]
> 연관된 파일로는 `provider.md`가 있으니 시간이 난다면 한 번 보는 것도 좋을 것 같다.

어떤 라이브러리를 만들기 위해 AI에게 코드 작성과 에러 수정 후 코드 분석을 하게 된 나... 시작부터 난관에 맞닥뜨리는데...

(대충 놀랍고 엄청나다는 이미지)

---

## 서론

코드를 분석하기 위해 `import` 부분부터 봤다. 뭐든 처음부터 보는 게 좋지 않은가... 그래서 코드를 봤는데 바로 모르는 것이 나와버렸다... `createContext`, `useContext`. 이게 대체 뭐지?

---

## Props

들어가기 전에 Context를 이해하려면 먼저 props를 알면 도움이 된다.

간단하게 설명하자면, 부모 컴포넌트가 자식 컴포넌트에게 데이터를 전달하는 방식이 props다. props는 간단하게 데이터를 전달할 수 있지만, 자식 컴포넌트 이상으로 데이터를 전달하려면 중간 단계의 컴포넌트에서 불필요하게 데이터를 처리해야 하는 문제가 발생한다.

<img width="640" height="382" alt="image" src="https://github.com/user-attachments/assets/a610d0a1-7621-4d82-b889-08746b7b2c8e" />

이런 상황을 속성이 여러 컴포넌트를 관통하는 것 같다고 해서 **Prop Drilling**이라고 한다.

<img width="1440" height="890" alt="image" src="https://github.com/user-attachments/assets/0cfbd9b6-991f-40e5-a95a-2dd663b7bff1" />

---

## 그래서 진짜로, Context. 그게 뭔데

해당 props drilling을 해결하기 위해 나온 게 바로 Context API다.

Context API는 앱에서 컴포넌트로 **props를 사용하지 않고 필요한 데이터를 쉽게 공유**할 수 있게 해준다. 특정 컴포넌트에서 제공하는 데이터를 하위 컴포넌트에서 사용할 수 있게 하는 것 — 중간 컴포넌트들을 거치지 않고, 필요한 컴포넌트가 직접 값을 꺼내 사용한다.

```tsx
import { createContext, useContext } from "react";

// 1. createContext 메서드로 context 생성
const MyContext = createContext(데이터의초기값);

// 2. Provider로 대상 컴포넌트를 감싸고, value에 전달할 데이터를 넣는다
<MyContext.Provider value={전달할데이터}>{children}</MyContext.Provider>;

// 3. 필요한 컴포넌트에서 useContext로 꺼내 쓴다 (공식 문서 권장 방식)
const 데이터 = useContext(MyContext);

// 참고: Consumer 컴포넌트 방식도 있지만, useContext 사용을 권장한다
<MyContext.Consumer>{(데이터) => <div>{데이터}</div>}</MyContext.Consumer>;
```

실제 예제로 보면:

```tsx
import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext); // "dark"를 받아옴
  return (
    <section className={"panel-" + theme}>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function Button({ children }) {
  const theme = useContext(ThemeContext); // 여기서도 "dark"를 받아옴
  return <button className={"button-" + theme}>{children}</button>;
}
```

---

## 주로 어디에 사용할까?

Context가 적합한 데이터 종류가 있다.

- **라이트 모드 / 다크 모드** 설정
- **사용자 데이터** (현재 인증된 유저 정보)
- **언어 혹은 지역 데이터**

공통점이 보이는가? 모두 **자주 업데이트할 필요가 없는 데이터**다. Context에서 `value`가 바뀌면 Provider로 감싼 모든 자식 컴포넌트들이 리렌더링되므로, 자주 바뀌는 값에는 적합하지 않다.

즉 Context는 *컴포넌트를 위한 전역 변수*의 개념이라고 볼 수 있다.

---

## Context를 사용하기 전에 고려할 것

Context는 사용하기에 꽤 유혹적이다. 그러나 이는 또한 남용하기 쉽다는 의미이기도 하다. **어떤 props를 여러 레벨 깊이로 전달해야 한다고 해서 해당 정보를 context에 넣어야 하는 것은 아니다.**

먼저 이 두 가지를 시도해보자.

**1. Props 전달하기로 시작하기.** 여러 컴포넌트를 거쳐 props가 흘러가는 것은 그리 이상한 일이 아니다. 힘든 일처럼 느껴질 수 있지만, 어떤 컴포넌트가 어떤 데이터를 사용하는지 매우 명확히 해줘서 유지보수하기 좋다.

**2. 컴포넌트를 추출하고 `children`으로 전달하기.** 이게 바로 Composition(합성)이라는 기법이다. 데이터를 쓰지도 않는 컴포넌트가 짐꾼 역할을 하고 있다면, 구조를 바꾸는 것이 먼저다.

```tsx
// Bad: Layout이 user를 쓰지도 않는데 받아야 함
function App() {
  const [user] = useState({ name: "홍길동" });
  return <Layout user={user} />;
}
function Layout({ user }) {
  return (
    <div>
      <Header user={user} />
    </div>
  ); // 그냥 전달만...
}

// Good: App에서 Header를 직접 렌더링해서 넣어버린다
function App() {
  const [user] = useState({ name: "홍길동" });
  return (
    <Layout>
      <Header user={user} /> {/* Layout은 user가 뭔지 몰라도 됨 */}
    </Layout>
  );
}
function Layout({ children }) {
  return <div>{children}</div>; // 그냥 구멍(Slot)만 뚫어놓으면 끝
}
```

`App` → `Layout` → `Header` 3단계였던 게, `App` → `Header`로 줄어든다. Layout은 껍데기가 되어 리렌더링 범위에서도 제외된다.

이래도 해결이 안 될 만큼 깊거나 광범위할 때 비로소 Context를 꺼내 드는 것이 React의 권장 순서다.

---

## Context랑 전역 상태 관리 라이브러리, 같은 거 아냐?

겉보기에는 Context API도 전역적으로 데이터를 뿌려주니까 Redux나 Zustand 같은 라이브러리의 대체제처럼 보일 수 있다. 허나 다르다.

**Context API의 핵심 설계 목적은 Dependency Injection(의존성 주입)이다.** 깊게 중첩된 컴포넌트 트리에서 Prop Drilling 없이 데이터를 하단으로 꽂아주는 **통로** 역할.

반면 상태 관리 도구는 단순히 값을 전달하는 것 외에 **효율적인 업데이트**가 가능해야 한다. Context의 치명적인 약점이 여기서 드러난다.

```
전역 상태 객체 { user, theme, posts }가 Context에 있다고 가정.
→ theme만 바뀌어도 user 정보만 쓰는 컴포넌트까지 전부 재렌더링된다.
```

Redux, Zustand, Recoil 같은 라이브러리는 내부적으로 최적화되어 있어서, `user`가 바뀌어도 `theme`을 구독 중인 컴포넌트는 눈 하나 깜짝 안 한다. 이게 바로 **전달**과 **관리**의 차이다.

| 특징          | Context API                    | 전역 상태 관리 라이브러리            |
| ------------- | ------------------------------ | ------------------------------------ |
| 주 목적       | Props 전달 생략, 결합도 낮추기 | 효율적인 상태 업데이트 및 로직 분리  |
| 렌더링 최적화 | 어려움 (구독자 전체 렌더링)    | 뛰어남 (변경된 부분만 선택적 렌더링) |
| 비동기 처리   | 직접 구현해야 함               | Middleware 등 내장/지원              |
| 디버깅 툴     | 기본 DevTools                  | 전용 DevTools (타임머신 디버깅 등)   |

요약하면:

- **Context** → 데이터를 어디로 보낼지 결정하는 **전송 수단**
- **Redux·Zustand** → 데이터를 어떻게 관리하고 효율적으로 변화시킬지 결정하는 **시스템**

---

## 그래서 언제 뭘 써야 할까?

**Context가 적합한 경우:** 값이 자주 바뀌지 않을 때 (테마, 언어, 로그인 유저 정보), 앱 전체보다는 특정 범위 내에서만 공유가 필요할 때.

**상태 관리 라이브러리가 적합한 경우:** 업데이트가 빈번하게 일어나는 복잡한 데이터, 컴포넌트 수백 개 중 특정 컴포넌트만 정밀하게 업데이트해야 할 때, 상태 관리 로직을 컴포넌트 외부로 완전히 분리하고 싶을 때.

---

## 고민

1. context가 props drilling 해결을 위해 사용하는 건 맞는데, 렌더링 측면에서 보면 context가 리렌더링을 많이 일으켜서 그렇게 좋다고는 생각을 안 함… 근데 어차피 자식의 자식의 자식으로 보내서 뭘 해도 리렌더링 일으키는 거, 그냥 편하게 최상단에서 context로 쏴버리자인가?
2. 근데 생각해보니 리렌더링은 값이 변화할 때만 일어나는 것이고… context가 변화하는 값에만 사용되는 게 아니라 그냥 변화하지 않는 일반적인 값을 내려줄 때도 사용되니… 양측에서 생각을…
3. 근데 거기서 더 생각해보니 안에 들어 있는 모든 컴포넌트가 리렌더링 되는 게 아니라 `useContext`를 사용하고 있는 애들만 리렌더링 되니까…

---

## 별록

`useContext`는 전달한 Context에 대한 Context Value를 반환한다. Context 값을 결정하기 위해 React는 컴포넌트 트리를 탐색하고, 특정 Context에 대해 상위에서 가장 가까운 Context Provider를 찾는다.

`value`에 `useState` 값을 넣으면 Context를 업데이트할 수 있다.

```tsx
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "Guest" });

  return <AppContext value={{ user, setUser }}>{children}</AppContext>;
};
```

+) 변하는 값에는 전역 상태 관리 라이브러리, 그저 props에 값을 전달할 때는 context도 괜찮을 것 같다.

---

\_참고: [heropy.dev](https://heropy.dev), [React 공식 문서](https://ko.react.dev/learn/passing-data-deeply-with-context)
