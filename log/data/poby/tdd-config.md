# TDD Config

## 배경

AI 시대에 TDD는 중요한 방법론으로 자리 잡혀있다. AI를 통해서 CURL로 API를 테스트하거나 검증을 받지만 이는 그리 효과적인 방법은 아니다. E2E 또는 API 단위 테스트를 통해서 배포전 CICD를 통해 검증하고 더 효율적으로 개발할 수 있다. 이를 학습하고자 TDD를 연습할 수 있는 환경을 제공하는 것이 목적이자 배경이다.

## 문제점

> [issue: TDD 환경구축 참고](https://github.com/4BFC/delllog/issues/5)

- Jest, Vitest 학습 미흡

## 원인

> [issue: TDD 환경구축 참고](https://github.com/4BFC/delllog/issues/5)

- FE 개발을 하면서 TDD로 개발할 수 있는 경험이 부족했다. 이를 통해서 학습하고자 한다.

## 해결 방안

> [issue: TDD 환경구축 참고](https://github.com/4BFC/delllog/issues/5)

## 결론

> [issue: TDD 환경구축 참고](https://github.com/4BFC/delllog/issues/5)

## 트러블슈팅

> TDD 환경 설정을 하면서 발생한 문제에 대한 트러블슈팅이 아닌 TDD 환경 구축을 통해서 오해와 개념 이슈에 관한 내용을 담고 있다.

Turbo라는 개념이 Turbopack만을 지칭하는 개념으로 알고 있었으나, Turborepo를 아울러 지칭하는 명사란 것을 알게 되었다. Turbopack은 webpack이나 vite와 같이 모든 Framework에 통용되는 번들러, 빌드 도구가 아닌 Next 전용 도구라는 것을 알았다. 개념은 동일하지만, Next에 특화 되어 생태계가 매운 좁다는 사실을 알게 되었다. Turbopack과 유사한 도구로는 Rspack이 있다.

> codex를 통해 정리한 표

| 관점 | Turbopack | Vite | Rspack | Webpack |
|---|---|---|---|---|
| 핵심 목적 | 초고속 개발 서버 + 증분 빌드 | 빠른 개발 서버 + 표준 빌드 | 고속 번들러, webpack 호환 | 범용 번들링 + 복잡한 최적화 |
| 개발 서버 | Next.js 중점, 매우 공격적 캐싱/증분 | esbuild 기반 HMR 빠름 | 내장 HMR/증분 빌드 강조 | 설정에 따라 편차 큼 |
| 프로덕션 번들 | 성숙도 진행 중 | Rollup 기반, 안정적 | webpack 호환 번들링 | 성숙, 대규모 프로젝트 강점 |
| 생태계 | Next.js 중심 | 프론트 생태계 넓음 | webpack 플러그인/로더 호환 강조 | 플러그인 풍부, 레거시 호환 |
| 설정 복잡도 | Next.js에선 낮음 | 낮음 | 중간 | 높음 |
| 적합한 상황 | Next.js 대형 앱 | 일반 SPA/라이브러리 | webpack 마이그레이션/고성능 필요 | 복잡한 번들 요구/레거시 |