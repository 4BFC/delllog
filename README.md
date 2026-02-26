# delllog

> 소수정예로 모인 개발자들과 함께 만들어 나가는 개발 탐방 기록지

<img width="600" alt="image" src="https://github.com/user-attachments/assets/cbfce107-c5e1-4a60-aabb-f091f482b93c" />

## 동기와 배경

`delllog`는 개발자와 지식을 공유하고 pr을 통해서 본인 탐구한 영역의 지식을 올리고 Review를 통해서 의견을 수렴하고 이를 반영해서 하나의 문서화를 목적으로 한다. 이는 프로그래밍의 언어만을 고수하는 것이 아니라, 본인이 생각하는 개발, 기술, 공학의 사고를 확장하고 사고의 전환을 이받이 하고자 한다. 이러한 뜻을 모은 개발자들의 지식의 창구이자 신시대(ERA) 기록지이며, 급변하고 있는 AI 시대에 `기술자`로서 살아 남기를 기대하며 희망한다.

## Rules

### 주제와 목표

기록은 `.md` 포멧이 기본 전재이며, 가능한 React 개발 환경에서 개발하기를 기대한다. 이외 본인이 사용하고 싶은 라이브러리는 `log/workspace`에서 편한대로 추가하고 관리하면 된다.

### Operation Conventions

0. PR을 전재로 문서 내용을 토의하고 관리한다.
1. 가능한 새로운 기능(feature), 환경(config, chore)와 같은 특수한 경우 one directory one PR을 규칙으로 한다.
2. main branch는 push 하지 않는다. 승인된 PR만 merge가 가능한 규칙으로 한다.
3. 최상위 디렉토리는 `delllog`와 `log` 두개를 규칙으로 한다.<br>
&emsp;i. `delllog`는 팀 블로그를 생성하기 위한 하나의 프로젝트 디렉토리이다.<br>
&emsp;ii. `log`는 개인이 공부하는 내용을 담아내는 공간이다.
4. `delllog` 디렉토리는 `workspace`와 `data` 두개를 규칙으로 한다.<br>
&emsp;i. `workspace`는 Framework 기반 개발 환경이 마련되어 있으며 해당 개발 환경에서 실습 예시를 작성하면 된다.<br>
&emsp;&emsp;a. `workspace`는 타 학습자가 작성한 코드를 수정할 수도 있으며, 본인의 코드가 수정될 수도 있는 공간이다. <br>&emsp;&emsp;따라서, 본인의 코드가 절대적인 공간이 아닐 뿐더러 github pr에 기록들이 남아 있으니 아쉬워말고 넓은 아량과 이해와 타협의 태도로 임하기를 바란다.<br>
&emsp;ii. `data`는 작성자가 학습한 내용을 담아내는 공간이다.<br>
&emsp;&emsp;a. `data` 디렉토리에는 작성자 github ID로 디렉토리를 생성하고 작성한다.

### Commit Conventions

> ref: [udacity-git-styleguide](https://udacity.github.io/git-styleguide/)

| Type      | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| feat      | A new feature                                                                 |
| fix       | A bug fix                                                                     |
| docs      | Changes to documentation                                                      |
| style     | Formatting, missing semi colons, etc; no code change                          |
| refactor  | Refactoring production code                                                   |
| test      | Adding tests, refactoring test; no production code change                     |
| chore     | Updating build tasks, package manager configs, etc; no production code change |

### Branch Conventions

Branch 전략은 `<username>/<topic>`과 같은 규칙으로 한다.

- 항시 Branch 네이밍은 소문자로 한다.
- 간결하게 작성하고 상세 내용은 커밋에 기록한다.
- 공백대신 `-`를 사용한다.

작성 요령 예시는 다음과 같다.

| 상황 | 브랜치 예시 |
|------|------------|
| poby가 react-hooks 학습 문서 작성 | `<username>/react-hooks` |
| poby가 workspace에 컴포넌트 추가 | `<username>/login-form` |
| 공통 설정 추가 | `<username>/config-eslint` |
| delllog 블로그 기능 개발 | `<username>/delllog-main-page` |
| 공통 설정 및 학습 문서를 복합적으로 작업을 실행한 경우 대표 작업을 브랜치로 두고 커밋 내역을 상세하게 작성한다. | `<username>/react-usememo` |

### Dir Structure (v0.1.0)

```md
.
  ├─ .gitignore
  ├─ AGENTS.md
  ├─ README.md
  ├─ delllog/
  └─ log/
    ├─ data/
    |  └─ <username>/
    └─ workspace/
    ├─ react/
    |  ├─ js/
    |  └─ ts/
    └─ nest/
```

### 팀 블로그 delllog

`delllog` 배포 프로젝트는 어느 정도 완성된 문서화가 자리잡히고 나면, 추가할 계획이다.

## FAQ

> 어떤 IDE를 추천하는가?

- 전통적인 VSC, VS를 사용해도 상관없다. 신현대 개발 환경을 위한 공간이기에 어떤 IDE를 사용해도 무관한다.

> 꼭, React여야 하는가.

- 그럴 필요는 없다. 단, 새로운 Framework는 pr 검토를 통해 승인이 나는 경우에만 merge가 가능하다.

### 다음 진행할 계획

- [ ] coderabbit 설정
- [ ] dependbot 설정
