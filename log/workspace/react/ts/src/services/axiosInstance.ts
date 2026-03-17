import axios from "axios";

// TODO: AB테스트가 용이하게 함수로 수정 필요
const API = 'https://698b4bb16c6f9ebe57bc3edb.mockapi.io/api/v1'

export const axiosInstance = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})