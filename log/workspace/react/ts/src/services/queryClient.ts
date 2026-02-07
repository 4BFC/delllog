import { QueryClient } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

/**
 * @TODO 각 페이지 설정을
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
 * @remark 외부에서 커스텀 주입을 할 떄 보다 좋은 방법이 있으면 좋겠다.
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