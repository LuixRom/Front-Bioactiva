import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
    toggleCollapsed: () => void;

    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;

    notificacionesPendientes: number;
    setNotificacionesPendientes: (count: number) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            sidebarCollapsed: false,
            toggleSidebar: () =>
                set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            closeSidebar: () => set({ sidebarOpen: false }),
            openSidebar: () => set({ sidebarOpen: true }),
            toggleCollapsed: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            globalLoading: false,
            setGlobalLoading: (loading) => set({ globalLoading: loading }),

            notificacionesPendientes: 0,
            setNotificacionesPendientes: (count) =>
                set({ notificacionesPendientes: count }),
        }),
        {
            name: 'bioactiva-ui',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);

