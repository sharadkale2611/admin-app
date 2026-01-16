// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Skip RSC / internal Next.js requests
    if (request.nextUrl.searchParams.has('_rsc')) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access-token')?.value;

    // Routes configuration
    const protectedRoutes = ['/dashboard', '/profile'];
    const guestOnlyRoutes = ['/login', '/register'];

    const isProtectedRoute = protectedRoutes.some(p =>
        pathname === p || pathname.startsWith(`${p}/`)
    );

    const isGuestOnlyRoute = guestOnlyRoutes.some(p =>
        pathname === p || pathname.startsWith(`${p}/`)
    );

    /*
     * ✅ RULE 1: Protect private routes
     * If no token → redirect to login
     */
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    /*
     * ✅ RULE 2: DO NOT force redirect from guest routes based on token
     * Let the app (Redux/AuthProvider) decide actual auth state
     * This prevents infinite redirect loops
     */
    if (isGuestOnlyRoute) {
        return NextResponse.next();
    }

    /*
     * ✅ RULE 3: Allow everything else
     */
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - image assets
         * - api/auth routes
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
    ],
};
