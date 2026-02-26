// TODO jsdoc annotation 추가 적으로 문서 필요
import { axiosInstance } from "./axiosInstance";

export interface User {
    id: number
    name: string
    username: string
    email: string
    phone: string
}

/**
 * @title Users list
 */
export async function getUsers(): Promise<User[]>{
    const { data } = await axiosInstance.get<User[]>('/users');
    return data;
}

/**
 * @title User
 */
export async function getUser(id: number): Promise<User>{
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data
}

/**
 * @title Create User
 */
export async function createUser(payload: { name: string; email: string }) {
    const { data } = await axiosInstance.post('/users', payload)
    return data
}

/**
 * @title Update User
 */
export async function updateUser(id: number, payload: Partial<User>) {
    const { data } = await axiosInstance.put<User>(`/users/${id}`, payload)
    return data
}