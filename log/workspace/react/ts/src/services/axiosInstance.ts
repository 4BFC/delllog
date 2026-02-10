import axios from "axios";

const API = 'https://698b4bb16c6f9ebe57bc3edb.mockapi.io/api/v1'

export const axiosInstance = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})