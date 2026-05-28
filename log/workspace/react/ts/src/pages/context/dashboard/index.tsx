// PropDrillingDashboard.tsx
// 실제 SaaS 대시보드에서 흔히 발생하는 prop drilling 지옥
// user 정보가 App → DashboardPage → DashboardLayout → Sidebar → SidebarMenu → SidebarMenuItem 까지 뚫고 내려감

import { useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";

// ============================================
// Types
// ============================================
type Plan = "free" | "pro" | "enterprise";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: Plan;
}

// ============================================
// App.tsx — 유저 상태 + 로그아웃 로직 보유
// ============================================
export default function App() {
  const [user, setUser] = useState<User>({
    id: "u_1a2b3c",
    name: "김지수",
    email: "jisu@company.io",
    avatarUrl:
      "https://i.pinimg.com/236x/3a/52/69/3a52694b8f231960a2625f838be6ea89.jpg",
    plan: "pro",
  });

  const [loggedIn, setLoggedIn] = useState(true);

  function handleLogout() {
    setLoggedIn(false);
    setUser({ id: "", name: "", email: "", avatarUrl: "", plan: "free" });
  }

  if (!loggedIn) {
    return (
      <div className="logged-out">
        <p>로그아웃됐습니다 👋</p>
        <button
          onClick={() => {
            setLoggedIn(true);
            setUser({
              id: "u_1a2b3c",
              name: "김지수",
              email: "jisu@company.io",
              avatarUrl:
                "https://i.pinimg.com/236x/3a/52/69/3a52694b8f231960a2625f838be6ea89.jpg",
              plan: "pro",
            });
          }}
        >
          다시 로그인
        </button>
      </div>
    );
  }

  // 😤 user랑 onLogout을 DashboardPage에 넘기기 시작...
  return <DashboardPage user={user} onLogout={handleLogout} />;
}

// ============================================
// DashboardPage.tsx
// user, onLogout 받아서 → DashboardLayout에 넘김
// 자기 자신은 그냥 페이지 타이틀만 씀
// ============================================
interface DashboardPageProps {
  user: User; // ← 직접 안 씀
  onLogout: () => void; // ← 직접 안 씀
}

function DashboardPage({ user, onLogout }: DashboardPageProps) {
  return (
    <div className="dashboard-page">
      {/* user는 여기서 안 쓰고, 그대로 Layout에 꽂아줌 */}
      <DashboardLayout user={user} onLogout={onLogout}>
        <MainContent />
      </DashboardLayout>
    </div>
  );
}

// ============================================
// DashboardLayout.tsx
// user, onLogout 받아서 → Sidebar에 넘김
// 자기 자신은 레이아웃 구조만 담당
// ============================================
interface DashboardLayoutProps {
  user: User; // ← 직접 안 씀
  onLogout: () => void; // ← 직접 안 씀
  children: React.ReactNode;
}

function DashboardLayout({ user, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      {/* 또 그대로 전달... */}
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main">{children}</main>
    </div>
  );
}

// ============================================
// Sidebar.tsx
// user, onLogout 받아서 → SidebarMenu에 넘김
// 자기 자신은 사이드바 껍데기만 담당
// ============================================
interface SidebarProps {
  user: User; // ← 직접 안 씀
  onLogout: () => void; // ← 직접 안 씀
}

function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">◈</span>
        <span className="logo-text">Vaultly</span>
      </div>
      {/* 또또 전달 */}
      <SidebarMenu user={user} onLogout={onLogout} />
    </aside>
  );
}

// ============================================
// SidebarMenu.tsx
// user, onLogout 받아서 → 각 SidebarMenuItem에 넘김
// 자기 자신은 메뉴 목록 구조만 담당
// ============================================
interface SidebarMenuProps {
  user: User; // ← 직접 안 씀 (아이템에 넘김)
  onLogout: () => void; // ← 직접 안 씀 (아이템에 넘김)
}

const MENU_ITEMS = [
  { id: "overview", icon: "⊞", label: "Overview", isActive: true },
  { id: "analytics", icon: "↗", label: "Analytics", isActive: false },
  { id: "files", icon: "⊟", label: "Files", isActive: false },
  { id: "settings", icon: "⊙", label: "Settings", isActive: false },
];

function SidebarMenu({ user, onLogout }: SidebarMenuProps) {
  return (
    <nav className="sidebar-menu">
      <ul>
        {MENU_ITEMS.map((item) => (
          // 😩 각 아이템마다 user랑 onLogout 박아서 전달
          <SidebarMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={item.isActive}
            user={user}
            onLogout={onLogout}
          />
        ))}
      </ul>

      {/* 하단 유저 프로필 + 로그아웃 — 드디어 여기서 씀! */}
      <SidebarUserPanel user={user} onLogout={onLogout} />
    </nav>
  );
}

// ============================================
// SidebarMenuItem.tsx
// user, onLogout 받지만... 아이콘/라벨 메뉴 아이템인데
// 굳이 user 정보가 왜 여기까지 내려와야 하지? 😑
// 결국 그냥 isActive 뱃지 표시할 때 plan 체크용으로 씀
// ============================================
interface SidebarMenuItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  user: User; // ← plan 체크 때문에 받긴 함...
  onLogout: () => void; // ← 여기선 안 씀. 근데 받아야 함 (SidebarUserPanel에 안 내려가니까)
}

function SidebarMenuItem({
  icon,
  label,
  isActive,
  user,
  onLogout, // 여기선 쓰지도 않는데 받아야 했던 불쌍한 prop
}: SidebarMenuItemProps) {
  const isLocked = label === "Analytics" && user.plan === "free";

  return (
    <li
      className={`menu-item ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
    >
      <span className="menu-icon">{icon}</span>
      <span className="menu-label">{label}</span>
      {isLocked && <span className="menu-badge">Pro</span>}
      {isActive && <span className="menu-active-dot" />}
    </li>
  );
}

// ============================================
// SidebarUserPanel.tsx
// 드디어! user + onLogout 실제로 쓰는 컴포넌트
// ============================================
interface SidebarUserPanelProps {
  user: User;
  onLogout: () => void;
}

const PLAN_LABEL: Record<Plan, string> = {
  free: "Free ♪",
  pro: "Pro ✦",
  enterprise: "Enterprise ◍",
};

function SidebarUserPanel({ user, onLogout }: SidebarUserPanelProps) {
  const [showMenu, setShowMenu] = useState(false);
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="user-panel">
      <button
        className="user-panel-trigger"
        onClick={() => setShowMenu((v) => !v)}
      >
        <div className="avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-plan">{PLAN_LABEL[user.plan]}</span>
        </div>
        <span className={`chevron ${showMenu ? "open" : ""}`}>›</span>
      </button>

      {showMenu && (
        <div className="user-menu">
          <div className="user-menu-email">{user.email}</div>
          <hr className="user-menu-divider" />
          <button className="user-menu-item">프로필 설정</button>
          <button className="user-menu-item">플랜 업그레이드</button>
          <hr className="user-menu-divider" />
          <button className="user-menu-item danger" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MainContent.tsx — props 없음, 그냥 콘텐츠
// ============================================
function MainContent() {
  return (
    <div className="main-content">
      <header className="content-header">
        <h1>Overview</h1>
        <span className="content-date">2025년 4월</span>
      </header>

      <div className="stats-grid">
        {[
          { label: "총 방문자", value: "24,821", delta: "+12.4%" },
          { label: "전환율", value: "3.6%", delta: "+0.8%" },
          { label: "월 매출", value: "₩4.2M", delta: "+21%" },
          { label: "활성 유저", value: "1,204", delta: "-2.1%" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span
              className={`stat-delta ${stat.delta.startsWith("-") ? "down" : "up"}`}
            >
              {stat.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="drill-callout">
        <span className="callout-icon">⚠</span>
        <div>
          <strong>Prop Drilling 경고</strong>
          <p>
            <code>user</code>와 <code>onLogout</code>은{" "}
            <strong>
              App → DashboardPage → DashboardLayout → Sidebar → SidebarMenu →
              SidebarMenuItem / SidebarUserPanel
            </strong>
            까지 6단계를 뚫고 내려갔습니다.
            <br />
            중간 컴포넌트 4개는 이 props를 <em>전달만</em> 했을 뿐 사용하지
            않았습니다.
          </p>
          <Link to="/context/dashboard/fix">
            <button className="move-route">수정 버전 가기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
