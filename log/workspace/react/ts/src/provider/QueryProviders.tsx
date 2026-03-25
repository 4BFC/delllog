import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "../services/queryClient";
import type { ReactNodeProps } from "../types";

interface QueryProvidersProps extends ReactNodeProps {
    queryClient?: ReturnType<typeof createQueryClient>
}

/**
 * @see {@link createQueryClient} 커스텀 QueryClient 생성
 * @example 커스텀 QueryClient 주입
 * const customClient = createQueryClient({ queries: { staleTime: 0 } })
 * <QueryProviders queryClient={customClient}>
 *   <App />
 * </QueryProviders>
 */
export function QueryProviders({children, queryClient}: QueryProvidersProps){
    // useRef가 의미상 맞다 판단 하였으나, 19버전 이후부터는 useRef를 렌더 중 ref.currnet를 읽게 되면 error가 발생
    const [client] = useState(() => queryClient ?? createQueryClient());    // 일반 함수 사용시 매번 새 인스턴스를 생성 따라 상태 값으로 동일 인스턴스 사용(팩토리 패턴)
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}