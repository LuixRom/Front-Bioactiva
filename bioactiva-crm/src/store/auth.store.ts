import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TOKEN_KEY, USER_KEY } from '@/lib/constants/config'
import { Usuario, AuthState } from '@/types/auth.types'
import { RolUsuario } from '@/types/enums'

interface AuthStore extends AuthState {
    setSession: (token: string, usuario: Usuario) => void
    clearSession: () => void
    setLoading: (isLoading: boolean) => void
    isAdministrador: () => boolean
    isWorker: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            usuario: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setSession: (token, usuario) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(TOKEN_KEY, token)
                    localStorage.setItem(USER_KEY, JSON.stringify(usuario))
                }
                set({
                    token,
                    usuario,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },
            clearSession: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(TOKEN_KEY)
                    localStorage.removeItem(USER_KEY)
                }
                set({
                    token: null,
                    usuario: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            },
            setLoading: (isLoading) => set({ isLoading }),
            isAdministrador: () => get().usuario?.rol === RolUsuario.Administrador,
            isWorker: () => get().usuario?.rol === RolUsuario.Trabajador,
        }),
        {
            name: 'bioactiva-auth',
            partialize: (state) => ({
                token: state.token,
                usuario: state.usuario,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)