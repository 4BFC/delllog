import { axiosInstance } from "./axiosInstance";

export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    avator: string
}

interface UsersResponse {
    page: number
    perPage: number
    total: number
    totalPages: number
    data: User[]
}

interface UserResponse {
    data: User
}

/** Users list */
export async function getUsers(page = 1): Promise<UsersResponse>{
    const { data } = await axiosInstance.get<UsersResponse>('/users', {
        params: { page }
    });

    return data;
}

/** User */
export async function getUser(id: number): Promise<User>{
    const { data } = await axiosInstance.get<UserResponse>(`/users/${id}`);
    return data.data
}

/** Create User
 * @TODO : GenricTypes 추가 필요, payload: interface UserRequired 필요
*/
export async function createUser(payload: {name: string; job: string;}) {
    const {data} = await axiosInstance.post('/users', payload)
    return data
}