// TODO: QueryKey를 관리 할 수 있는 디렉토리 필요
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUser, createUser } from "../services/users.axios";

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
    const QueryClient = useQueryClient()

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            QueryClient.invalidateQueries({queryKey: userKeys.lists()})
        }
    })
}
