// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export function middleware(request: NextRequest) {

    if (request.nextUrl.searchParams.has('_rsc')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('access-token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/dashboard', '/profile'];
    const guestOnlyRoutes = ['/login', '/register'];

    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isGuestOnlyRoute = guestOnlyRoutes.some(p => pathname.startsWith(p));

    if (isProtectedRoute && !token) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    if (isGuestOnlyRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, etc.
         * - api/auth routes (if using NextAuth.js)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
    ],
};







