import { QueryClient } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

/**
 * @TODO 각 페이지 설정 기준으로 관리할 수 있게 분리 필요.
 */
const DEFAULT_OPTIONS: QueryClientConfig['defaultOptions'] = {
    queries: {
        staleTime: 1000 * 6 * 5,    //5m
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,    // 탭 전환에 따른 refetch 여부
    },
}

/**
const TEST_OPTIONS: QueryClientConfig['defaultOptions'] = {
    queries: {
        staleTime: 1000 * 6 * 5,    //5m
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,    // 탭 전환에 따른 refetch 여부
    },
}

const STORYBOOK_OPTIONS: QueryClientConfig['defaultOptions'] = {
    queries: {
        staleTime: 1000 * 6 * 5,    //5m
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,    // 탭 전환에 따른 refetch 여부
    },
}
*/

/**
 * @description 대규모 도메인 관리라 가정하고 생성한 함수이다. 따라서, createQueryClient는 micro frontend와 같은 개념으로 접목해서 사용하면 좋겠단 생각을 했다.
 * @deprecated 해당 함수를 각 페이지별로 override해서 관리해보려 했으나. 이는 캐시 분리, 데이터 공유 불가, 메모리 낭비와 같은 안티 패턴이다.
 * @remark 추후 전역 관리로 이관 예정, 외부에서 주입을 할 떄 보다 좋은 방법이 있으면 좋겠다. 더불어 페이지가 아닌 성격이 다른 도메인과 같은 곳에서 사용하면 효과적이다.
 */

export function createQueryClient (options?: QueryClientConfig['defaultOptions']): QueryClient{
    return new QueryClient({
        defaultOptions: {
            queries: {
                ...DEFAULT_OPTIONS?.queries,
                ...options?.queries,    // override
            },
            mutations: {
                ...DEFAULT_OPTIONS?.mutations,
                ...options?.mutations,    // undefined
            }
        },
    })
}