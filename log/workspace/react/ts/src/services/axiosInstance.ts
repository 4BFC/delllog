import axios from "axios";

const API = '/api'

export const axiosInstance = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_REQRES_API_KEY,
    }
})