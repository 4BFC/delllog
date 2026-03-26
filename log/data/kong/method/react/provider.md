# 프로-바이더

## 서론

하,,,,

분명? 나는 리액트 컴포넌트의 성능을 런타임에도 적은 오버헤드로 telemetry 할 수 있는 프로파일링 라이브러리를 만들고 있었는데, 해당 라이브러리를 그냥 쌩으로 만들기에는 지식이 너무 없었다.

그래서 claude에게 설계를 보여주며 짜달라고 했고, 해당 코드들을 분석 후 다시 처음부터 내가 만들려고 했다.

그런데 코드 분석 중 `createContext`과 `useContext`을 맞닥뜨리게 되었다… 그게 뭔데? `useState`나 `useRef`같은 것들만 사용해오던 나에게는…. 너무 어려웠다….n

공식 문서를 자세하게 읽어봐도 잘 모르겠어서 아는 프론트엔드 개발자분들께 여쭤보니 context가 최상단에서 상태를 저장해두고 상단에서 context provider를 설정해두고 쏴주는거라고,,, 약간 전역 변수처럼 쓰이는 친구인가보다...

> Redux, recoil, tq의 조상격(?),,,? 전역으로 변수 설정이 가능한 친구...
> useContext with Providers 참고....
> 전역 라이브러리와 context API 차이...
> provider 컴파운드 컴포넌트도 따로 분리...

예...? provider가 뭔데요...?

---

## 그래서 provider는 또 뭔데? (context.provider)

```js
<MyContext.Provider value={/* 어떤 값 */}>
```

리액트로 컴포넌트를 만들 때 상태값 관리는 보통 props나 state로 관리한다.
이외에도 상태 관리 라이브러리가 있다.

context에 포함된 react provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 한다.
provider 컴포넌트는 value prop을 받아서 이 값을 하위에 있는 컴포넌트에게 전달한다. 값을 전달받을 수 있는 컴포넌트 수에 제한은 없다.
provider 하위에 또 다른 provider를 배치하는 것도 가능하며, 이 경우 하위 provider의 값이 우선시된다.

Provider의 역할은 우리의 App이 Redux.store에 접근할 수 있도록 해준다.
그러니까 provider는 HOC로 context를 제공하고, react가 제공하는 createContext 메서드를 활용하여 context 객체를 만들어낼 수 있다.
Provider 컴포넌트는 value라는 prop으로 하위 컴포넌트들에게 내려줄 데이터를 받는다. 이 컴포넌트의 모든 자식 컴포넌트들은 해당 provider를 통해 value prop에 접근할 수 있다.

요약: provider 안에 있는 자식 컴포넌트들은 provider 라인에서 선언한 context를 value와 useContext를 통해 받을 수 있다.

```js
function App() {
  const data = { ... }

  return (
    <div>
      <DataContext value={data}>
        <SideBar />
        <Content />
      </DataContext>
    </div>
  )
}

function SideBar() {
  const { data } = React.useContext(DataContext);
  return <h1>{data.text}</h1>;
}

```

이런 식으로 각 컴포넌트에서 useContext를 import 하는 대신 필요로 하는 컨텍스트를 직접 반환하는 훅을 구현할 수 있다.

```js
function useThemeContext() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return theme;
}
```

---

가만히 보면 그냥 context랑 별반 다를 게 없는 친구 아니야? 싶겠지만, 그건 내가 이해를 잘못 해서 그런 것이었다.
provider와 context는 역할이 다르다...
provider는 값을 넣는 쪽, context는 값을 꺼내는 쪽이라고 보면 될 것 같다.
Provider 없이 useContext만 쓰면 값이 null이고, useContext 없이 Provider만 쓰면 값을 꺼내지 못한다...

```js
const UserContext = createContext(null);

// Provider → 값을 "넣는" 쪽
<UserContext value={{ name: "홍길동" }}>
  <App />
</UserContext>;

// useContext → 값을 "꺼내는" 쪽
function GrandChild() {
  const user = useContext(UserContext); // 꺼냄
}
```

---

기존에 provider를 사용할 때는 ~context.provider를 했어야 했는데, React 19로 올라오면서 `<SomeContext.Provider>` 대신 `<SomeContext>`를 바로 Provider로 렌더링할 수 있다.

```js
// React 18 이하 (구버전)
<ThemeContext.Provider value={theme}>
  <Page />
</ThemeContext.Provider>

// React 19 이상 (신버전) — 완전히 동일한 동작
<ThemeContext value={theme}>
  <Page />
</ThemeContext>
```

## 참고

[Provider 패턴](https://patterns-dev-kr.github.io/design-patterns/provider-pattern/)
-> 괜찮은 기술?블로그입니다. 참고하시면 좋을 것 같아요.
