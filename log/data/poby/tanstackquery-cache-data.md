# TanStack Query Stale Cache

## 배경

상세 정보에서 사용자의 데이터를 변경 또는 수정을 하고 다시 리스트로 돌아가면 리스트에서는 과거의 데이터가 남아 있는 경우가 있다. 이럴 때, cache를 invalidateQueries를 사용해서 무력화 하는데, invalidateQueries가 동작하는 방식과 invalidateQueries 대시 다른 대안과 해결책을 모색하는 것이 목표이자, 배경이다.

## 문제점

1. 불필요한 네트워크 요청 - 이미 mutation 응답에 새 데이터가 있는데 또 fetch
2. Stale cache 문제 - 상호작용 되어야하는 페이지간 querykey를 여러번 호출
3. UX 저하 - 업데이트 후 깜빡임

## 원인

> 해당 문서는 문제점 2번을 중점으로 바라본 문서이다.

invalidateQueries를 사용하면 cache를 강제로 refetch를 한다고 이해를 했다. 하지만, invalidateQueries는 cache의 상태를 stale 상태로 변경을 하고 마운트 언마운트 상태에 따라 refetch의 수행이 이루어진다. invalidateQueries의 동작방식은 ~~(TQ는 cache를 신선도에 따라 상태를 분리한다.)~~ 현재 key의 cache가 fresh 하던 stale 하던 상관 없이 stale로 상태를 둔다. 그리고 현 페이지가 ~~(invalidateQueries를 호출하고)~~ 마운트가 된 상태라면 refetch가 된다. 정리하자면, 상세 페이지에서는 invalidateQueries로 stale mark를 찍고 마운트가 되면 refetch가 이루어진다. 단, 목록 페이지에서는 cache의 상태값을 변경하는 로직이 없기 때문에, 변경된 값이 반영되지 않고 이전 데이터가 보이는 것이다.

## 해결 방안

> useUsers.ts의 [useUpdateUser](../../workspace/react/ts/src/hooks/useUsers.ts) 참고

- setQueryData
  - setQueryData를 사용해서 직접 특정 querykey를 업데이트, 리스트도 함께 업데이트 하는 방법이 있다.

  ```ts
  export function useUpdateUser() {
      const queryClient = useQueryClient()

      return useMutation({
          mutationFn: ({ id, ...payload }) => updateUser(id, payload),
          onSuccess: (newUser) => {
              // 서버 응답으로 캐시 직접 업데이트
              queryClient.setQueryData(
                  userKeys.detail(newUser.id),
                  newUser
              )
              // 리스트도 업데이트
              queryClient.setQueryData(userKeys.lists(), (old) =>
                  old?.map(user => user.id === newUser.id ? newUser : user)
              )
          }
      })
  }
  ```

- Optimistic update
  - 낙관적 업데이트 방법은 실문에서 자주 사용했다. 변경된 UI를 Network 요청 결과와는 무관하게 즉시 없데이트를 하고, onError와 같은 실패 시 롤백 할 수 있게 구현을 방법이다.

  ```ts
  useMutation({
      mutationFn: updateUser,
      onMutate: async (newData) => {
          await queryClient.cancelQueries({ queryKey: userKeys.lists() })
          const previous = queryClient.getQueryData(userKeys.lists())

          // 즉시 UI 업데이트
          queryClient.setQueryData(userKeys.lists(), (old) =>
              old?.map(u => u.id === newData.id ? {...u, ...newData} : u)
          )
          return { previous }
      },
      onError: (err, newData, context) => {
          // 실패 시 롤백
          queryClient.setQueryData(userKeys.lists(), context.previous)
      }
  })
  ```

## 결론

처음에는 InvalidateQueries가 좋지 않은 anti-pattern이거나 TQ에서 권장하지 않는 방식이라 생각했다. 하지만, 개념을 다시 정리하고 살펴보면 단순히 cache의 신선도를 stale로 변경하고 해당 query가 호출, 구독된 컴포넌트(QueryObserver)를 마운트 언마운트에 따라 refetch가 결정되는 방식이란 것을 이해하고 다시 코드 useUsers.ts의 useUpdateUser함수를 보면 lists도 다음과 같이 invalidateQueries를 하면 되는 것 아닌가 싶었다.

```ts
onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userKeys.details()})
            queryClient.invalidateQueries({queryKey: userKeys.lists()})
        }
```

즉, querykey가 체이닝되는 관계성만 명확하게 명시, 기획이 되어 있다면, InvalidateQueries가 성능을 저하하거나 좋지 않은 방식은 아니라 생각이 된다. 이외의 다른 관점으로 InvalidateQueries의 평가 문제 정의가 필요하다고 생각한다.

---

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
- [query-invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation)
- [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- [Mutation 이후 전체 Query를 invalidation 하기](https://yogjin.tistory.com/130)
