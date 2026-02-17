# TanStack Query Stale Cache

## 배경

## 원인

## 해결 방안

## 트러블슈팅

현재 TQ provider의 query 설정 외부 주입할 수 있게 작성을 했다. 이런 방법은 현재로는 매우 오버스팩일 수 있겠다는 생각을 했다.

### createQueryClinet anti-pattern

- 현재 createQueryClient는 micro 디렉토리 전략 방식에 사용하기 위해서 분리를 했으나 이로 인해서 발생하는 문제는 다음과 같다.
  - 각 페이지간 서로의 캐시를 공유할 수 없게된다. 즉, Provider간 key 값이 달라지기 때문에 그렇다. 그로 인해서 메모리 낭비가 발생한다. 매번 QueryClinet가 여러개 새로 생성되기 때문이다.

- 그렇다면 createQueryClinet는 어떻게 사용하면 좋을까?
  - 테스트 환경에서 사용하면 좋다.
  - 환경별(dev/prod)와 같이 분리된 공간에서 사용하면 좋다.
  - 임베디드 위젯과 같이 독립된 곳에서 사용하면 좋다.
  - Storybook과 같은 곳에서 사용하면 좋다.
  - 즉, 모노레포와 같은 곳에서 사용, 각기 다른 도메인과 같은 곳에서 사용하면 좋다. 따라서 해상 createQueryClient는 common이나 shared같은 곳에서 관리하면서 사용하면 좋다.

- 결론은 개별 쿼리 훅(ex.useUsers)에서 관리하면서 사용하는 것이 좋다.

### 참고 문서

- [micro frontend](https://jobkaehenry.tistory.com/64)
