import axios from "axios";

const API = 'https://reqres.in/api'

export const axiosInstance = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})