'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { useAuthStore, useUIStore } from '@/store'
import { ROUTES } from '@/lib/constants/routes'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { isAuthenticated, usuario } = useAuthStore()
    const { sidebarCollapsed, sidebarOpen } = useUIStore()

    useEffect(() => {
        if (!isAuthenticated || !usuario) {
            router.replace(ROUTES.auth.login)
        }
    }, [isAuthenticated, usuario, router])

    if (!isAuthenticated || !usuario) return null

    return (
        <div className="min-h-screen bg-gray-50">

            <Sidebar />

            <div
                className={`
          transition-all duration-300 flex flex-col min-h-screen
          ${sidebarOpen
                        ? sidebarCollapsed
                            ? 'lg:ml-16'
                            : 'lg:ml-60'
                        : 'ml-0'
                    }
        `}
            >
                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}