import { createContext, useContext } from "react";
import "./context.css";

// export function index() {
//   const ProviderTest = createContext<string>("");
//   return <ProviderTest value={"코테의 Map"}></ProviderTest>;
// }

// types.ts
interface UserInfo {
  name: string;
  email: string;
  role: "admin" | "user";
}

interface UserInfoFix {
  name: string;
  email: string;
  role: "admin" | "user";
  theme: string;
  locale: string;
}

// ============================================
// App.tsx — 데이터 원천
// ============================================
const ProviderTest = createContext<UserInfoFix>({
  name: "",
  email: "",
  role: "admin",
  theme: "",
  locale: "",
});

function index() {
  const userInfo: UserInfo = {
    name: "김철수",
    email: "kim@example.com",
    role: "admin",
  };
  const theme = "dark";
  const locale = "ko-KR";

  return (
    <div className="app">
      <Page userInfo={userInfo} theme={theme} locale={locale} />
      <ProviderTest
        value={{
          name: "김철수",
          email: "kim@example.com",
          role: "admin",
          theme,
          locale,
        }}
      >
        <PageFix />
      </ProviderTest>
    </div>
  );
}

// ============================================
// Page.tsx — 쓰지도 않으면서 전달만 함 😑
// ============================================
interface PageProps {
  userInfo: UserInfo;
  theme: string;
  locale: string;
}

function Page({ userInfo, theme, locale }: PageProps) {
  return (
    <div className="page">
      <h1>페이지</h1>
      {/* userInfo, theme, locale 하나도 안 씀 */}
      <Section userInfo={userInfo} theme={theme} locale={locale} />
    </div>
  );
}

function PageFix() {
  return (
    <div className="page">
      <h1>페이지 context 사용</h1>
      {/* userInfo, theme, locale 하나도 안 씀 */}
      <SectionFix />
    </div>
  );
}

// ============================================
// Section.tsx — 마찬가지로 그냥 통과 👆
// ============================================
interface SectionProps {
  userInfo: UserInfo;
  theme: string;
  locale: string;
}

function Section({ userInfo, theme, locale }: SectionProps) {
  return (
    <div className="section">
      <h2>섹션</h2>
      {/* 이것도 안 씀 ㅎ */}
      <Panel userInfo={userInfo} theme={theme} locale={locale} />
    </div>
  );
}

function SectionFix() {
  return (
    <div className="section">
      <h2>섹션</h2>
      {/* 이것도 안 씀 ㅎ */}
      <PanelFix />
    </div>
  );
}

// ============================================
// Panel.tsx — 역시 패스 🤦
// ============================================
interface PanelProps {
  userInfo: UserInfo;
  theme: string;
  locale: string;
}

function Panel({ userInfo, theme, locale }: PanelProps) {
  return (
    <div className="panel">
      <h3>패널</h3>
      <Widget userInfo={userInfo} theme={theme} locale={locale} />
    </div>
  );
}

function PanelFix() {
  return (
    <div className="panel">
      <h3>패널</h3>
      <WidgetFix />
    </div>
  );
}

// ============================================
// Widget.tsx — 또 패스 😭
// ============================================
interface WidgetProps {
  userInfo: UserInfo;
  theme: string;
  locale: string;
}

function Widget({ userInfo, theme, locale }: WidgetProps) {
  return (
    <div className="widget">
      <DeepChild userInfo={userInfo} theme={theme} locale={locale} />
    </div>
  );
}

function WidgetFix() {
  return (
    <div className="widget">
      <DeepChildFix />
    </div>
  );
}

// ============================================
// DeepChild.tsx — 드디어!!!! 여기서 씀 🎉
// ============================================
interface DeepChildProps {
  userInfo: UserInfo;
  theme: string;
  locale: string;
}

function DeepChild({ userInfo, theme, locale }: DeepChildProps) {
  return (
    <div className={`deep-child theme-${theme}`}>
      <p>
        안녕하세요, <span className="user-name">{userInfo.name}</span>님!
      </p>
      <p>
        권한:
        <span className={`badge ${userInfo.role}`}>
          {userInfo.role === "admin" ? "관리자" : "일반 사용자"}
        </span>
      </p>
      <p>
        언어 설정: <span className="locale-tag">{locale}</span>
      </p>
    </div>
  );
}

function DeepChildFix() {
  const userInfo = useContext(ProviderTest);
  return (
    <div className={`deep-child theme-${userInfo.theme}`}>
      <p>
        안녕하세요, <span className="user-name">{userInfo.name}</span>님!
      </p>
      <p>
        권한:
        <span className={`badge ${userInfo.role}`}>
          {userInfo.role === "admin" ? "관리자" : "일반 사용자"}
        </span>
      </p>
      <p>
        언어 설정: <span className="locale-tag">{userInfo.locale}</span>
      </p>
    </div>
  );
}

export default index;
