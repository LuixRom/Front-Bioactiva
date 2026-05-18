import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '@/lib/constants/config'
import { ROUTES } from '@/lib/constants/routes'

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window != 'undefined') {
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window != 'undefined') {
                localStorage.removeItem(TOKEN_KEY)
                window.location.href = ROUTES.auth.login
            }
        }

        const backendMessage =
            (error.response?.data as { message?: string })?.message

        return Promise.reject({
            status: error.response?.status,
            message: backendMessage ?? 'Ocurrió un error inesperado',
            data: error.response?.data
        })
    }
)

export { apiClient }