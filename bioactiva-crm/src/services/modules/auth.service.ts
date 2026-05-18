import { USE_MOCK } from '@/lib/constants/config'
import { ENDPOINTS } from '@/services/api/endpoints'
import { apiClient } from '@/services/api/client'
import {
    mockLogin, mockForgotPassword, mockValidateToken, mockResetPassword,
    mockActivateAccount,
} from '@/services/mock/auth.mock'
import {
    LoginRequest, LoginResponse, ForgotPasswordResponse, ResetPasswordResponse,
    ActivateAccountRequest, ActivateAccountResponse, ValidateTokenResponse,
    Usuario,
} from '@/types/auth.types'

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        if (USE_MOCK) return mockLogin(data)
        const response = await apiClient.post<LoginResponse>(
            ENDPOINTS.auth.login,
            data,
        )
        return response.data
    },

    forgotPassword: async (correo: string): Promise<ForgotPasswordResponse> => {
        if (USE_MOCK) return mockForgotPassword(correo)
        const response = await apiClient.post<ForgotPasswordResponse>(
            ENDPOINTS.auth.forgotPassword,
            { correo },
        )
        return response.data
    },

    validateToken: async (token: string): Promise<ValidateTokenResponse> => {
        if (USE_MOCK) return mockValidateToken(token)
        const response = await apiClient.get<ValidateTokenResponse>(
            ENDPOINTS.auth.validateToken(token),
        )
        return response.data
    },

    resetPassword: async (token: string, password: string): Promise<ResetPasswordResponse> => {
        if (USE_MOCK) return mockResetPassword(token, password)
        const response = await apiClient.post<ResetPasswordResponse>(
            ENDPOINTS.auth.resetPassword,
            { token, password }
        )
        return response.data
    },

    activateAccount: async (data: ActivateAccountRequest): Promise<ActivateAccountResponse> => {
        if (USE_MOCK) return mockActivateAccount(data)
        const response = await apiClient.post<ActivateAccountResponse>(
            ENDPOINTS.auth.activate,
            data,
        )
        return response.data
    },

    getMe: async (): Promise<Usuario> => {
        if (USE_MOCK) throw { status: 501, message: 'No implementado en mock' }
        const response = await apiClient.get<Usuario>(ENDPOINTS.auth.me)
        return response.data
    },

    logout: async (): Promise<void> => {
        if (USE_MOCK) return
        await apiClient.post(ENDPOINTS.auth.logout)
    },
}