import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUser, createUser, updateUser } from "../services/users.axios";

/**
 * @TODO query-key-factory를 관리할 수있게 리팩토링
 */
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (page: number) => [...userKeys.lists(), page] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
}

export function useUsers(){
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: getUsers,
        staleTime: 1000 * 60 * 5, // 5분 - stale cache 재현용
    })
}

export function useUser(id: number){
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUser(id),
        enabled: !!id,
    })
}


export function useCreateUser(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userKeys.lists()});
        }
    })
}

// TODO: 반환 type 설정 필요
export function useUpdateUser(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, ...payload }: { id: number } & Partial<{ name: string; email: string }>) =>
            updateUser(id, payload),
        // TODO: 비동기를 async를 사용해서 동기화 해서 await으로 Network 순서를 보장할 수 있게 리팩토링 필요
        onSuccess: () => {
            // details 캐시만 invalidate - stale cache 문제 재현용
            queryClient.invalidateQueries({queryKey: userKeys.details()});
            // await queryClient.invalidateQueries({queryKey: userKeys.lists()}); // inavlidate로 cache fresh 상태로 변경
            queryClient.fetchQuery({ queryKey: userKeys.lists(), queryFn: getUsers});   // fetchQuery를 사용하면 mutationFn이 PUT이 동작하고 queryFn 콜백 함수로 GET이 동작한다. 그리고 users까지 즉, api 3번 호출
        }
    })
}
