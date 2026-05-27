import { NextRequest, NextResponse } from 'next/server'
import { RolUsuario } from '@/types/enums'

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password', '/activate', '/accept-invitation']
const ADMIN_PATHS = ['/control-acceso']

export function proxy(request: NextRequest) {
    const token = request.cookies.get('bioactiva_token')?.value
    const rol = request.cookies.get('bioactiva_rol')?.value
    const { pathname } = request.nextUrl

    const isPublicPath = PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
    const isAdminPath = ADMIN_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (token && isAdminPath && rol !== RolUsuario.Administrador) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)'],
}
