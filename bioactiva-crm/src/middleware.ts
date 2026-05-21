import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password', '/activate']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('bioactiva_token')?.value
    const { pathname } = request.nextUrl

    const isPublicPath = PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)'],
}
